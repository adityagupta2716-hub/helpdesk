const {
    createTicketFromDraft
} = require("../../../../ticket/TicketCreationService.js");

const UIComponent=require("../../../sdk/ui/UIComponent.js");

const ToolResult = require("../../../sdk/ToolResult.js");

async function createTicket(
    parameters,
    context
)
{
    try
    {
        const draft =
            parameters.draft ??
            context.activeDraft;

        const ticket =
            await createTicketFromDraft({

                draft,

                sessionId:
                context.sessionId,

                user:
                context.user

            });

        return ToolResult.success({

            summary:
            "Support ticket created successfully.",

            data:{

                ticketId:
                ticket._id.toString(),

                title:
                ticket.title,

                status:
                ticket.status,

                department:
                ticket.department,

                category:
                ticket.category,

                priority:
                ticket.priority,

                createdAt:
                ticket.createdAt

            },

            metadata:{
                navigation:{
                    type:"ticket",
                    ticketId:ticket._id.toString()
                }
            },

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
            ]

        });

    }
    catch(error)
    {
        return ToolResult.failure({

            summary:
            "Failed to create support ticket.",

            error:{

                code:
                "TICKET_CREATION_FAILED",

                message:
                error.message

            }

        });
    }
}

module.exports = {
    createTicket
};