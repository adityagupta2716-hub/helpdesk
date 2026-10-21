const {
    analyzeIntent
}=require("../../../intentAnalysisService.js");
const ToolResult=require("../../sdk/ToolResult.js");
async function analyzeIntentTool(
    parameters={},
    context
)
{
    const{
        message=context.latestUserMessage?.content,
        chatHistory=context.history
    }=parameters;

    if(!message)
    {
        throw new Error("No message available for intent analysis");
    }

    const result=await analyzeIntent(
        message,
        chatHistory
    );

    return ToolResult.success({
        summary:
        `The student's request was classified as "${result.intent}".`,

        data:{
            intent:result.intent,
            department:result.department,
            category:result.category,
            priority:result.priority,
            title:result.title,
            description:result.description,
            draftAction:result.draftAction,
            needsMoreInfo:result.needsMoreInfo,
            reason:result.reason
        }
    });
}

module.exports={
    analyzeIntentTool
};