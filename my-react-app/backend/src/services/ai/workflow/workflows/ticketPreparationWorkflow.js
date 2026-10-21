const WorkflowResult=require("../workflowResult.js");
const {
    getActiveDraft,
    updateDraft,
    clearDraft
}=require("../../../chatDraftService.js");

const {
    prepareTicket
}=require("../../../ticketPreparation/preparationService.js");

const {
    mergePreparationResult
}=require("../../../ticketPreparation/mergePreparationResult.js");

const {
    classifyTransition
}=require("./ticketPreparation/classifier/transitionClassifier.js");

const {
    createTicketFromDraft
}=require("../../../ticket/TicketCreationService.js");

const UIComponent=require("../../sdk/ui/UIComponent.js");

function handled({
    status,
    response,
    draft=null,
    metadata={}
})
{
    return WorkflowResult.handled({
        workflow:"ticketPreparation",
        status,
        response,
        draft,
        metadata
    });
}

async function execute({
    message,
    history=[],
    context
})
{
    try{
    if(!context.sessionId)
    {
        return WorkflowResult.ignored();
    }
    const existingDraft=await getActiveDraft(context.sessionId);

    if(!existingDraft)
    {
        return WorkflowResult.ignored();
    }
     console.log("\n=================================");
        console.log("TICKET PREPARATION WORKFLOW");
        console.log("=================================");

        console.log("Active Draft Found");

        console.dir(existingDraft,{
            depth:null,
            colors:true
        });

    const transition=await classifyTransition({
        latestMessage:message,
        history,
        workflow:"ticketPreparation",
        workflowState:{
            stage:
            existingDraft.preparation?.ticketReady
            ?"confirmation"
            :"collecting"
        },
        draft:existingDraft
    });

    console.log("\nTransition");

        console.dir(
            transition,
            {
                depth:null,
                colors:true
            }
        );

    switch(transition.transition)
    {
        case "CONFIRM":
            {
                if(!existingDraft.preparation?.ticketReady)
                {
                    return WorkflowResult.handled({
                        workflow:"ticketPreparation",
                        status:"collecting",
                        response:
                        "I still need a little more information before I can create your ticket.",
                        draft:existingDraft
                    });
                }
                const ticket=await createTicketFromDraft({
                    draft:existingDraft,
                    sessionId:context.sessionId,
                    user:context.user
                });
                return WorkflowResult.handled({
                    workflow:"ticketPreparation",
                    status:"completed",
                    response:
                    `Your support ticket has been created successfully.\n\nTicket ID: ${ticket._id}\n\nOur support team will review it shortly.`,
                    draft:null,
                    ui:[
                        UIComponent.ticket({
                            id:ticket._id.toString(),
                            title:ticket.title,
                            status:ticket.status,
                            priority:ticket.priority,
                            department:ticket.department,
                            category:ticket.category,
                            createdAt:ticket.createdAt
                        })
                    ],
                    metadata:{
                        ticket:{
                            id:ticket._id.toString(),
                            title:ticket.title,
                            status:ticket.status
                        }
                    }

                });
            }
        case "CANCEL":
            {
                await clearDraft(
                    context.sessionId
                );
                return WorkflowResult.handled({
                    workflow:"ticketPreparation",
                    status:"cancelled",
                    response:"No problem. I've cancelled the ticket preparation.",
                    draft:null
                });
            }
        case "INTERRUPT":
            {
                console.log("Workflow interupted. Passing control back to planner.");
                return WorkflowResult.ignored();
            }
        case "MODIFY":

        case "UNKNOWN":
            {
                const preparation=await prepareTicket({
                    latestMessage:message,
                    history,
                    draft:existingDraft,
                    intent:context.intent
                });
                console.log("\nPreparation Result");

                console.dir(
                    preparation,
                    {
                        depth:null,
                        colors:true
                    }
                );
                if(!preparation || typeof preparation!=="object")
                {
                    throw new Error(
                        "Preparation service returned an invalid response."
                    )
                }

                const mergedDraft=mergePreparationResult(
                    existingDraft,
                    preparation
                );
                console.log("\nMerged Draft");

                console.dir(
                    mergedDraft,
                    {
                        depth:null,
                        colors:true
                    }
                );

                const shouldPersist =

                    preparation.shouldMerge ||

                    Boolean(preparation.preparationState) ||

                    Boolean(preparation.nextQuestion) ||

                    preparation.ticketReady === true;

                if(shouldPersist)
                {
                    await updateDraft(
                        context.sessionId,
                        mergedDraft
                    );
                }

                switch(preparation.workflow)
                {
                    case "cancel":
                        {
                            await clearDraft(context.sessionId);
                            return WorkflowResult.handled({
                                workflow:"ticketPreparation",
                                status:"cancelled",
                                response:
                                "I've cancelled the ticket preparation.",
                                draft:null
                            });
                        }
                    case "interrupt":
                        {
                            console.log("Preparation interrupted");
                            return WorkflowResult.ignored();
                        }
                    case "continue":
                        {
                            return WorkflowResult.handled({
                                workflow:"ticketPreparation",
                                status:"collecting",
                                response:preparation.nextQuestion?.question
                                ??
                                preparation.nextQuestion
                                ??
                                "Could you provide a little more information?",
                                draft:mergedDraft
                            });
                        }
                    case "ready":
                        {
                            return WorkflowResult.handled({
                                workflow:"ticketPreparation",
                                status:"ready",
                                response:"I now have enough information to create your support ticket.\n\nWould you like me to create it?",
                                draft:mergedDraft
                            });
                        }
                    default:
                        {
                            throw new Error(
                                `Unknown preparation workflow "${preparation.workflow}".`
                            );
                        }
                }
            }
        default:
            {
                throw new Error(
                    `Unknown transition "${transition.transition}".`
                );
            }
        }
    }
    catch(error)
    {
        console.error("\n=================================");
        console.error("TICKET PREPARATION WORKFLOW ERROR");
        console.error("=================================");

        console.error(error);

        return handled({

            status:"failed",

            response:
                "I'm sorry, something went wrong while continuing your ticket preparation. Please try again.",

            draft:null,

            metadata:{
                error:error.message
            }

        });
    }
}

module.exports={
    execute
};