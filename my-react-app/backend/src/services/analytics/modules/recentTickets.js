const Ticket=require("../../../models/Ticket.js");

const {
    buildTicketQuery
}=require("../../ai/utils/buildTicketQuery.js");

async function getRecentTickets(
    filters={}
)
{
    const query=buildTicketQuery(filters);

    const tickets=await Ticket.find(query)
    .populate(
        "createdBy",
        "name email"
    )
    .populate(
        "assignedTo",
        "name email"
    )
    .sort({
        createdAt:-1
    })
    .limit(5);

    return{
        recentTickets:tickets.map(ticket=>({

            id:ticket._id.toString(),

            title:ticket.title,

            description:ticket.description,

            department:ticket.department,

            category:ticket.category,

            priority:ticket.priority,

            status:ticket.status,

            createdAt:ticket.createdAt,

            resolvedAt:ticket.resolvedAt,

            createdBy:ticket.createdBy
            ?{
                id:ticket.createdBy._id.toString(),
                name:ticket.createdBy.name,
                email:ticket.createdBy.email
            }
            :null,

            assignedTo:ticket.assignedTo
            ?{
                id:ticket.assignedTo._id.toString(),
                name:ticket.assignedTo.name,
                email:ticket.assignedTo.email
            }
            :null

        }))
    };
}

module.exports={
    getRecentTickets
};