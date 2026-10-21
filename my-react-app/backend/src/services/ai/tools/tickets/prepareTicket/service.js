const {
    prepareTicket
}=require("../../../../ticketPreparation/preparationService.js");
const {
    mergePreparationResult
}=require("../../../../ticketPreparation/mergePreparationResult.js");

const {
    saveDraft,
    updateDraft,
    getActiveDraft
}=require("../../../../chatDraftService.js");

const ToolResult=require("../../../sdk/ToolResult.js");

async function prepareTicketService(
    {
        latestMessage
    },
    context
)
{
    const session=context.session;
    const existingDraft=await getActiveDraft(session._id);
    const preparation=await prepareTicket({
        latestMessage,
        history:context.history,
        draft:existingDraft,
        intent:context.intent
    });

    const mergedDraft=mergePreparationResult(existingDraft,preparation);

    if(preparation.workflow==="cancel")
    {
        return ToolResult.success({
            summary:preparation.summary,

            data:{
                workflow:"cancel",
                ticketReady:false,
                nextQuestion:null,
                draft:null
            }
        });
    }
    else if(preparation.workflow==="interrupt")
    {
        return ToolResult.success({
            summary:preparation.summary,
            data:{
                workflow:"interrupt",
                ticketReady:false,
                nextQuestion:null,
                draft:existingDraft
            }
        });
    }

    if(existingDraft)
    {
        await updateDraft(
            session._id,
            mergedDraft
        );
    }
    else{
        await saveDraft(
            session._id,
            mergedDraft
        );
    }

    return ToolResult.success({
        summary:preparation.summary,

        data:{
            workflow:
            preparation.workflow,

            ticketReady:
            preparation.ticketReady,

            nextQuestion:
            preparation.nextQuestion,

            draft:
            mergedDraft
        }
    });
}

module.exports={
    prepareTicketService
};