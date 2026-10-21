const accountCreated=require("./accountCreated");

const ticketCreatedStudent=require("./ticketCreatedStudent");
const ticketCreatedAdmin=require("./ticketCreatedAdmin");

const ticketAssignedStudent=require("./ticketAssignedStudent");
const ticketAssignedStaff=require("./ticketAssignedStaff");

const ticketReassignedStudent=require("./ticketReassignedStudent");
const ticketReassignedStaff=require("./ticketReassignedStaff");
const ticketReassignedPreviousStaff=require("./ticketReassignedPreviousStaff");
const ticketReassignedAdmin=require("./ticketReassignedAdmin");

const ticketUpdatedAdmin=require("./ticketUpdatedAdmin");
const ticketUpdatedStaff=require("./ticketUpdatedStaff");

const ticketResolvedStudent=require("./ticketResolvedStudent");
const ticketResolvedStaff=require("./ticketResolvedStaff");
const ticketResolvedAdmin=require("./ticketResolvedAdmin");

const ticketClosedStudent=require("./ticketClosedStudent");
const ticketClosedStaff=require("./ticketClosedStaff");

const ticketCancelledStudent=require("./ticketCancelledStudent");
const ticketCancelledStaff=require("./ticketCancelledStaff");
const ticketCancelledAdmin=require("./ticketCancelledAdmin");

const ticketReviewApprovedStudent=require("./ticketReviewApprovedStudent");
const ticketReviewApprovedStaff=require("./ticketReviewApprovedStaff");

const ticketReviewRejectedStudent=require("./ticketReviewRejectedStudent");
const ticketReviewRejectedStaff=require("./ticketReviewRejectedStaff");

const resolutionNotesAddedStudent=require("./resolutionNotesAddedStudent");

const ticketInProgressStudent=require("./ticketInProgressStudent");

const templates={

    "account.created":accountCreated,

    "ticket.created.student":ticketCreatedStudent,
    "ticket.created.admin":ticketCreatedAdmin,

    "ticket.assigned.student":ticketAssignedStudent,
    "ticket.assigned.staff":ticketAssignedStaff,

    "ticket.reassigned.student":ticketReassignedStudent,
    "ticket.reassigned.staff":ticketReassignedStaff,
    "ticket.reassigned.previousStaff":ticketReassignedPreviousStaff,
    "ticket.reassigned.admin":ticketReassignedAdmin,

    "ticket.updated.admin":ticketUpdatedAdmin,
    "ticket.updated.staff":ticketUpdatedStaff,

    "ticket.resolved.student":ticketResolvedStudent,
    "ticket.resolved.staff":ticketResolvedStaff,
    "ticket.resolved.admin":ticketResolvedAdmin,

    "ticket.closed.student":ticketClosedStudent,
    "ticket.closed.staff":ticketClosedStaff,

    "ticket.cancelled.student":ticketCancelledStudent,
    "ticket.cancelled.staff":ticketCancelledStaff,
    "ticket.cancelled.admin":ticketCancelledAdmin,

    "ticket.review.approved.student":ticketReviewApprovedStudent,
    "ticket.review.approved.staff":ticketReviewApprovedStaff,

    "ticket.review.rejected.student":ticketReviewRejectedStudent,
    "ticket.review.rejected.staff":ticketReviewRejectedStaff,

    "ticket.resolutionNotes.student":resolutionNotesAddedStudent,

    "ticket.inProgress.student":ticketInProgressStudent

};

function getTemplate(event)
{
    const template=templates[event];

    if(!template)
    {
        throw new Error(
            `Unknown notification template "${event}".`
        );
    }

    return template;
}

module.exports={
    getTemplate
};