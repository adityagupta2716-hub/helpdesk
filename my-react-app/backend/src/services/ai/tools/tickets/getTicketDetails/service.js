const mongoose = require("mongoose");
const Ticket = require("../../../../../models/Ticket.js");
const TicketTimeline = require("../../../../../models/TicketTimeline.js");
const ToolResult = require("../../../sdk/ToolResult.js");
const UIComponent = require("../../../sdk/ui/UIComponent.js");

function getNextActionRecommendation(status, role) {
    switch (status) {
        case "Open":
            if (role === "admin") return "Admin should assign this ticket to an available departmental staff technician.";
            if (role === "staff") return "Department staff should claim this ticket or update status to Assigned/In Progress.";
            return "Ticket is currently Open and awaiting assignment by campus helpdesk staff.";
        case "Assigned":
            if (role === "staff") return "Assigned staff should begin work and change status to 'In Progress'.";
            return "A technician has been assigned and will begin working on the issue shortly.";
        case "In Progress":
            if (role === "staff") return "Technician should complete the fix and submit detailed resolution notes before marking Resolved.";
            return "Technician is actively working on the resolution.";
        case "Resolved":
        case "Pending Review":
            if (role === "admin") return "Admin should review the technician's resolution notes and either Approve (Close) or Reject (reopen).";
            return "Issue has been resolved by staff and is awaiting final administrative verification.";
        case "Closed":
            return "Ticket has been verified, approved, and closed. No further action is required.";
        case "Canceled":
            return "Ticket was canceled. If the problem persists, a new ticket should be created.";
        default:
            return "Check with the campus helpdesk administrator for next steps.";
    }
}

async function getTicketDetailsService(parameters, context) {
    const { ticketId } = parameters;

    if (!ticketId || typeof ticketId !== "string") {
        return ToolResult.failure({
            summary: "Ticket ID parameter is required.",
            error: { code: "MISSING_ID", message: "Please provide a valid ticket ID." }
        });
    }

    const cleanId = ticketId.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        return ToolResult.failure({
            summary: `"${cleanId}" is not a valid ticket ID format. Ticket IDs must be 24-character hexadecimal identifiers.`,
            error: { code: "INVALID_ID", message: "Invalid MongoDB ObjectId format." }
        });
    }

    const ticket = await Ticket.findById(cleanId)
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role department");

    if (!ticket) {
        return ToolResult.failure({
            summary: `No ticket was found matching ID "${cleanId}".`,
            error: { code: "NOT_FOUND", message: `Ticket ${cleanId} does not exist in the database.` }
        });
    }

    // Role-based authorization check
    const userRole = context.role;
    const userId = context.userId ? context.userId.toString() : null;

    if (userRole === "student") {
        const creatorId = ticket.createdBy?._id?.toString() || ticket.createdBy?.toString();
        if (creatorId !== userId) {
            return ToolResult.failure({
                summary: `Access denied. You are not authorized to view ticket "${cleanId}" because it was raised by another student.`,
                error: { code: "UNAUTHORIZED", message: "Students are restricted to their own tickets." }
            });
        }
    } else if (userRole === "staff") {
        const userDept = context.user?.department;
        const assignedId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
        const matchesDept = userDept && ticket.department && ticket.department.toLowerCase() === userDept.toLowerCase();
        const isAssigned = assignedId === userId;

        if (!matchesDept && !isAssigned) {
            return ToolResult.failure({
                summary: `Access denied. Ticket "${cleanId}" belongs to the "${ticket.department}" department, which is outside your assigned department.`,
                error: { code: "UNAUTHORIZED", message: "Staff may only view department or assigned tickets." }
            });
        }
    }

    // Retrieve timeline milestones
    const timeline = await TicketTimeline.find({ ticket: ticket._id })
        .sort({ createdAt: 1 })
        .limit(10);

    const formattedTimeline = timeline.map(t => ({
        title: t.title,
        description: t.description,
        eventType: t.eventType,
        date: t.createdAt
    }));

    const nextAction = getNextActionRecommendation(ticket.status, userRole);

    const ticketData = {
        id: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        department: ticket.department,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        resolvedAt: ticket.resolvedAt || null,
        closedAt: ticket.closedAt || null,
        createdBy: {
            name: ticket.createdBy?.name || "Student",
            email: ticket.createdBy?.email || "Unknown"
        },
        assignedTo: ticket.assignedTo ? {
            name: ticket.assignedTo.name,
            email: ticket.assignedTo.email,
            department: ticket.assignedTo.department
        } : null,
        resolutionNotes: ticket.resolutionNotes || "None documented yet.",
        adminReview: ticket.adminReview?.reviewNotes ? {
            decision: ticket.adminReview.decision,
            notes: ticket.adminReview.reviewNotes,
            date: ticket.adminReview.reviewedAt
        } : null,
        timeline: formattedTimeline,
        nextActionRecommendation: nextAction
    };

    return ToolResult.success({
        summary: `Retrieved ticket "${ticket.title}" (Status: ${ticket.status}, Priority: ${ticket.priority}, Department: ${ticket.department}). Next action: ${nextAction}`,
        data: ticketData,
        ui: [
            UIComponent.ticket({
                id: ticket._id.toString(),
                title: ticket.title,
                status: ticket.status,
                priority: ticket.priority,
                department: ticket.department,
                category: ticket.category,
                createdAt: ticket.createdAt
            })
        ]
    });
}

module.exports = {
    getTicketDetailsService
};
