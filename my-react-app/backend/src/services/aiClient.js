const OpenAI = require("openai");

/**
 * Validates whether an environment variable contains a real, non-placeholder API key.
 */
function isValidKey(val) {
    if (!val || typeof val !== "string") return false;
    const trimmed = val.trim();
    if (!trimmed) return false;
    if (trimmed.toLowerCase() === "placeholder") return false;
    if (trimmed.startsWith("your_")) return false;
    return true;
}

/**
 * Resolves the active AI provider based on configured environment variables.
 */
function resolveProvider() {
    if (isValidKey(process.env.DEEPSEEK_API_KEY)) {
        return {
            provider: "deepseek",
            apiKey: process.env.DEEPSEEK_API_KEY.trim(),
            model: process.env.AI_MODEL || "deepseek-chat"
        };
    }
    if (isValidKey(process.env.GEMINI_API_KEY)) {
        return {
            provider: "gemini",
            apiKey: process.env.GEMINI_API_KEY.trim(),
            // Use gemini-3.5-flash-lite as default — fast, stable and highly available
            model: (process.env.AI_MODEL && process.env.AI_MODEL.toLowerCase().includes("gemini"))
                ? process.env.AI_MODEL
                : "gemini-3.5-flash-lite"
        };
    }
    if (isValidKey(process.env.OPENAI_API_KEY)) {
        return {
            provider: "openai",
            apiKey: process.env.OPENAI_API_KEY.trim(),
            model: process.env.AI_MODEL || "gpt-4o-mini"
        };
    }
    return null;
}

/**
 * Standard content extraction from diverse input formats (string, Gemini contents array, etc.)
 */
function extractPrompt(input) {
    if (typeof input === "string") {
        return input;
    }
    if (input && input.contents && Array.isArray(input.contents)) {
        return input.contents
            .map(message =>
                message.parts
                    ? message.parts.map(part => part.text || "").join("\n")
                    : (message.text || "")
            )
            .join("\n");
    }
    throw new Error("Unsupported generateContent input format.");
}

/**
 * Main generateContent function called by plannerModel, responseGenerator, and preparationModel.
 * Returns { response: { text() } } shape so all callers work unchanged.
 */
async function generateContent(input) {
    const config = resolveProvider();

    if (!config) {
        throw new Error(
            "AI Provider is not configured. Please set a valid GEMINI_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY in backend/config.env."
        );
    }

    const prompt = extractPrompt(input);
    const isJsonRequested = input?.generationConfig?.responseMimeType === "application/json";
    const temperature = input?.generationConfig?.temperature ?? 0;
    const maxTokens = input?.generationConfig?.maxOutputTokens ?? 2048;

    const TIMEOUT_MS = 25000;

    if (config.provider === "gemini") {
        try {
            // Use the new @google/genai v2 SDK which targets the v1 endpoint
            const { GoogleGenAI } = require("@google/genai");
            const ai = new GoogleGenAI({ apiKey: config.apiKey });

            const modelName = config.model || "gemini-3.5-flash-lite";

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI Request Timeout: Gemini did not respond within 25 seconds.")), TIMEOUT_MS)
            );

            const generatePromise = ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    temperature,
                    maxOutputTokens: maxTokens,
                    ...(isJsonRequested ? { responseMimeType: "application/json" } : {})
                }
            });

            const result = await Promise.race([generatePromise, timeoutPromise]);
            const responseText = result.text;

            return {
                response: {
                    text() {
                        return responseText;
                    }
                }
            };
        } catch (error) {
            handleProviderError("Gemini", error);
        }
    }

    if (config.provider === "deepseek" || config.provider === "openai") {
        const isDeepseek = config.provider === "deepseek";
        const client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: isDeepseek ? "https://api.deepseek.com" : undefined,
            timeout: TIMEOUT_MS
        });

        try {
            const completion = await client.chat.completions.create({
                model: config.model,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature,
                max_tokens: maxTokens,
                response_format: isJsonRequested ? { type: "json_object" } : undefined
            });

            const content = completion.choices[0]?.message?.content || "";
            return {
                response: {
                    text() {
                        return content;
                    }
                }
            };
        } catch (error) {
            handleProviderError(isDeepseek ? "DeepSeek" : "OpenAI", error);
        }
    }
}

function handleProviderError(providerName, error) {
    const msg = error.message || "";
    const status = error.status || error.statusCode;

    if (status === 401 || msg.includes("401") || msg.toLowerCase().includes("authentication fail") || msg.toLowerCase().includes("invalid api key")) {
        throw new Error(
            `AI Authentication Failed: The API key for ${providerName} is invalid. Please verify your ${providerName.toUpperCase()}_API_KEY in backend/config.env.`
        );
    }

    if (status === 429 || msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate limit")) {
        throw new Error(
            `AI Rate Limit Exceeded: The free-tier quota or rate limit has been reached for ${providerName}. Please check your account usage or try again later.`
        );
    }

    if (msg.includes("Timeout") || msg.includes("timed out") || error.code === "ETIMEDOUT") {
        throw new Error(
            `AI Request Timeout: ${providerName} took longer than 25 seconds to respond. Please try again.`
        );
    }

    throw new Error(`AI Provider Error (${providerName}): ${error.message}`);
}

module.exports = {
    generateContent,
    resolveProvider
};