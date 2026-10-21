function parsePlannerOutput(rawText)
{
    const cleaned=rawText.replace(/```json/g,"")
    .replace(/```/g,"").trim();

    const parsed=JSON.parse(cleaned);
    return parsed;
}

module.exports={
    parsePlannerOutput
};