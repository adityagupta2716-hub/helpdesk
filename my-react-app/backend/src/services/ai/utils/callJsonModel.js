const model=require("../../aiClient.js");
async function callJsonModel(
    prompt,
    {
        temperature=0,
        maxOutputTokens=512
    }={}
)
{
    const result=await model.generateContent({
        contents:[
            {
                role:"user",
                parts:[
                    {
                        text: prompt
                    }
                ]
            }
        ],

        generationConfig:{
            responseMimeType:"application/json",
            temperature,
            maxOutputTokens
        }
    });

    const text=result.response.text();
    console.log("\n==============================");
    console.log("RAW JSON MODEL OUTPUT");
    console.log("==============================\n");

    console.log(text);

    console.log("\n==============================\n");
    try{
        return JSON.parse(text);
    }
    catch(error)
    {
        console.error("JSON PARSE FAILED");
        console.error(error);
        throw new Error(`Model returned invalid JSON.\n\n${text}`);
    }

    return result.response.text();
}

module.exports={
    callJsonModel
};