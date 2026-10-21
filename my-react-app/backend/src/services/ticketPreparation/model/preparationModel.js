const model=require("../../aiClient.js");

async function callPreparationModel(prompt)
{
    const result=await model.generateContent(prompt);

    return result.response.text();
}

module.exports={
    callPreparationModel
};