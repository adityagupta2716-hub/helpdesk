const Ticket=require("../../../models/Ticket.js");

const {
    buildTicketQuery
}=require("../../ai/utils/buildTicketQuery.js");

async function getTicketOverview(filters={})
{
    const query=buildTicketQuery(filters);

    const tickets=await Ticket.find(query).select(
        "status priority"
    );

    const overview={

        totalTickets:0,

        openTickets:0,

        assignedTickets:0,

        inProgressTickets:0,

        pendingReviewTickets:0,

        resolvedTickets:0,

        closedTickets:0,

        canceledTickets:0,

        highPriorityOpenTickets:0,

        resolutionRate:0
    };

    overview.totalTickets=tickets.length;

    for(const ticket of tickets)
    {
        switch(ticket.status)
        {
            case "Open":
                overview.openTickets++;
                break;

            case "Assigned":
                overview.assignedTickets++;
                break;

            case "In Progress":
                overview.inProgressTickets++;
                break;

            case "Pending Review":
                overview.pendingReviewTickets++;
                break;

            case "Resolved":
                overview.resolvedTickets++;
                break;

            case "Closed":
                overview.closedTickets++;
                break;

            case "Canceled":
                overview.canceledTickets++;
                break;
        }

        if(
            ticket.priority==="High" &&
            ![
                "Resolved",
                "Closed",
                "Canceled"
            ].includes(ticket.status)
        )
        {
            overview.highPriorityOpenTickets++;
        }
    }

    const completed=
        overview.resolvedTickets+
        overview.closedTickets;

    overview.resolutionRate=
        overview.totalTickets===0
        ?0
        :Number(
            (
                (completed/overview.totalTickets)*100
            ).toFixed(2)
        );

    return overview;
}

module.exports={
    getTicketOverview
};