const {
    getAllTickets
}=require("../../../../ticket/TicketService.js");

const ToolResult=require("../../../sdk/ToolResult.js");

const UIComponent=require("../../../sdk/ui/UIComponent.js");

async function getAllTicketsTool(parameters)
{
    const result=await getAllTickets(parameters);

    const formattedTickets=result.tickets.map(ticket=>({

        id:ticket._id.toString(),

        title:ticket.title,

        department:ticket.department,

        category:ticket.category,

        priority:ticket.priority,

        status:ticket.status,

        createdAt:ticket.createdAt,

        createdBy:{
            id:ticket.createdBy?._id?.toString(),
            name:ticket.createdBy?.name,
            email:ticket.createdBy?.email
        }

    }));

    return ToolResult.success({

        summary:`Retrieved ${result.returnedTickets} of ${result.totalTickets} ticket(s).`,

        data:{

            totalTickets:result.totalTickets,

            returnedTickets:result.returnedTickets,

            tickets:formattedTickets

        },

        metadata:{

            navigation:{
                type:"ticket_list",
                hasMore:result.hasMore
            }

        },

        ui:[
            UIComponent.ticketList({

                tickets:formattedTickets,

                totalTickets:result.totalTickets,

                hasMore:result.hasMore

            })
        ]

    });
}

module.exports={
    getAllTicketsTool
};