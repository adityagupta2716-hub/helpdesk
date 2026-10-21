const Ticket = require("../../../../../models/Ticket.js");
const ToolResult = require("../../../sdk/ToolResult.js");
const UIComponent = require("../../../sdk/ui/UIComponent.js");

async function getStaffTicketsService(parameters = {}, context) {
    const {
        assignedToMeOnly = false,
        status = null,
        priority = null,
        sortBy = "createdAt",
        sortOrder = "desc",
        limit = 5,
        includeAll = false
    } = parameters;

    const staffId = context.userId;
    const staffDept = context.user?.department;

    const query = {};

    if (assignedToMeOnly) {
        query.assignedTo = staffId;
    } else {
        query.$or = [
            { assignedTo: staffId },
            ...(staffDept ? [{ department: staffDept }] : [])
        ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    let ticketsQuery = Ticket.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort(sortOption);

    if (!includeAll) {
        ticketsQuery = ticketsQuery.limit(limit);
    }

    const [tickets, totalCount] = await Promise.all([
        ticketsQuery.exec(),
        Ticket.countDocuments(query)
    ]);

    const formattedTickets = tickets.map(ticket => ({
        id: ticket._id.toString(),
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        department: ticket.department,
        category: ticket.category,
        createdAt: ticket.createdAt,
        createdBy: {
            name: ticket.createdBy?.name || "Student",
            email: ticket.createdBy?.email || "Unknown"
        },
        assignedTo: ticket.assignedTo?.name || "Unassigned"
    }));

    return ToolResult.success({
        summary: `Found ${totalCount} departmental/assigned ticket(s). Returning ${formattedTickets.length} matching ticket(s).`,
        data: {
            totalTickets: totalCount,
            returnedTickets: formattedTickets.length,
            tickets: formattedTickets
        },
        ui: [
            UIComponent.ticketList({
                tickets: formattedTickets,
                totalTickets: totalCount,
                hasMore: totalCount > formattedTickets.length
            })
        ]
    });
}

module.exports = {
    getStaffTicketsService
};
