const Ticket = require("../../../../../models/Ticket.js");
const ToolResult = require("../../../sdk/ToolResult.js");

function getStartOfPeriod(timeframe) {
    const now = new Date();
    const d = new Date(now);
    if (timeframe === "today") {
        d.setHours(0, 0, 0, 0);
        return d;
    }
    if (timeframe === "this_week") {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    if (timeframe === "this_month") {
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    return null;
}

async function getTicketStatisticsService(parameters = {}, context) {
    const { timeframe, department, category, priority } = parameters;
    const userRole = context.role;
    const userId = context.userId;

    const matchQuery = {};

    // Role-based scoping
    if (userRole === "student" && userId) {
        matchQuery.createdBy = userId;
    } else if (userRole === "staff" && context.user?.department) {
        matchQuery.department = context.user.department;
    }

    if (department && userRole === "admin") {
        matchQuery.department = department;
    }
    if (category) {
        matchQuery.category = category;
    }
    if (priority) {
        matchQuery.priority = priority;
    }

    const startDate = getStartOfPeriod(timeframe);
    if (startDate) {
        matchQuery.createdAt = { $gte: startDate };
    }

    // Execute aggregate queries in parallel
    const now = new Date();
    const startOfWeek = getStartOfPeriod("this_week");

    const [
        totalTickets,
        statusCounts,
        priorityCounts,
        categoryStats,
        resolvedThisWeek,
        longestPendingTickets
    ] = await Promise.all([
        Ticket.countDocuments(matchQuery),
        Ticket.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        Ticket.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]),
        Ticket.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
        Ticket.countDocuments({
            ...matchQuery,
            $or: [
                { status: "Resolved", updatedAt: { $gte: startOfWeek } },
                { resolvedAt: { $gte: startOfWeek } },
                { status: "Closed", updatedAt: { $gte: startOfWeek } }
            ]
        }),
        Ticket.find({
            ...matchQuery,
            status: { $in: ["Open", "In Progress", "Assigned"] }
        })
        .sort({ createdAt: 1 })
        .limit(5)
        .select("title status priority department category createdAt")
    ]);

    const formattedStatus = {
        Open: 0,
        "In Progress": 0,
        Resolved: 0,
        Closed: 0,
        Assigned: 0,
        Canceled: 0
    };
    statusCounts.forEach(s => {
        if (s._id) formattedStatus[s._id] = s.count;
    });

    const formattedPriority = {
        Low: 0,
        Medium: 0,
        High: 0
    };
    priorityCounts.forEach(p => {
        if (p._id) formattedPriority[p._id] = p.count;
    });

    const topCategories = categoryStats.map(c => ({
        category: c._id || "Uncategorized",
        count: c.count
    }));

    const formattedPendingLongest = longestPendingTickets.map(t => {
        const ageMs = now - new Date(t.createdAt);
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
        return {
            id: t._id.toString(),
            title: t.title,
            status: t.status,
            priority: t.priority,
            department: t.department,
            category: t.category,
            createdAt: t.createdAt,
            pendingTime: ageDays > 0 ? `${ageDays} day(s)` : `${ageHours} hour(s)`
        };
    });

    const summaryScope = userRole === "student"
        ? "your personal tickets"
        : userRole === "staff"
            ? `the ${context.user?.department || "staff"} department`
            : "campus-wide helpdesk";

    return ToolResult.success({
        summary: `Verified statistics for ${summaryScope}: Total: ${totalTickets}, Open: ${formattedStatus.Open}, In Progress: ${formattedStatus["In Progress"]}, Resolved: ${formattedStatus.Resolved}, Closed: ${formattedStatus.Closed}. Resolved this week: ${resolvedThisWeek}.`,
        data: {
            scope: summaryScope,
            totalTickets,
            openTickets: formattedStatus.Open,
            inProgressTickets: formattedStatus["In Progress"],
            resolvedTickets: formattedStatus.Resolved,
            closedTickets: formattedStatus.Closed,
            assignedTickets: formattedStatus.Assigned,
            canceledTickets: formattedStatus.Canceled,
            statusBreakdown: formattedStatus,
            priorityBreakdown: formattedPriority,
            topCategories,
            resolvedThisWeek,
            ticketsPendingLongest: formattedPendingLongest
        }
    });
}

module.exports = {
    getTicketStatisticsService
};
