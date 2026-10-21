const Ticket = require("../../../../../models/Ticket.js");
const ToolResult = require("../../../sdk/ToolResult.js");
const UIComponent = require("../../../sdk/ui/UIComponent.js");

async function getMyTickets(parameters, context) {
    const {
        limit = 5,
        includeAll = false,
        status = null,
        priority = null,
        department = null,
        category = null,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = parameters;

    const query = {
        createdBy: context.userId
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (department) query.department = department;
    if (category) query.category = category;

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    let ticketsQuery = Ticket.find(query).sort(sortOption);

    if (!includeAll) {
        ticketsQuery = ticketsQuery.limit(limit);
    }

    const [tickets, overallTicketCount, matchingCount] = await Promise.all([
        ticketsQuery.exec(),
        Ticket.countDocuments({ createdBy: context.userId }),
        Ticket.countDocuments(query)
    ]);

    const formattedTickets = tickets.map(ticket => ({
        id: ticket._id.toString(),
        title: ticket.title,
        department: ticket.department,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt
    }));

    return ToolResult.success({
        summary: `Found ${overallTicketCount} total ticket(s) created by you. Returning ${formattedTickets.length} matching ticket(s)${status ? ` with status "${status}"` : ""}${priority ? ` and priority "${priority}"` : ""}.`,
        data: {
            totalTickets: overallTicketCount,
            matchingTickets: matchingCount,
            returnedTickets: formattedTickets.length,
            tickets: formattedTickets
        },
        metadata: {
            navigation: {
                type: "ticket_list",
                hasMore: matchingCount > formattedTickets.length,
                ticketIds: formattedTickets.map(ticket => ticket.id)
            }
        },
        ui: [
            UIComponent.ticketList({
                tickets: formattedTickets,
                totalTickets: matchingCount,
                hasMore: matchingCount > formattedTickets.length
            })
        ]
    });
}

module.exports = {
    getMyTickets
};