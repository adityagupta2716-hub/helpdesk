function parsePreparationOutput(rawText)
{
    const cleaned = rawText
        .replace(/```json/g,"")
        .replace(/```/g,"")
        .trim();

    return JSON.parse(cleaned);
}

module.exports={
    parsePreparationOutput
};