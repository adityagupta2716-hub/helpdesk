const model=require("../../../aiClient.js");
async function callPlannerModel(prompt)
{
    const result=await model.generateContent(prompt);

    return result.response.text();
}

module.exports=
{
    callPlannerModel
};