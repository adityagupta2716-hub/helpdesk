const TicketService=require("./TicketService");

const {
    completeDraft,
    clearDraft
}=require("../chatDraftService");

async function createTicketFromDraft({
    draft,
    sessionId,
    user
})
{
    if(!draft)
    {
        throw new Error(
            "Cannot create a ticket without an active draft."
        );
    }

    const {
        title,
        description,
        department,
        category,
        priority="Medium",
    }=draft;

    if(
        !title ||
        !description ||
        !department ||
        !category
    )
    {
        throw new Error(
            "Draft is incomplete. Required ticket fields are missing."
        );
    }

    const ticket=await TicketService.createTicket({
        title,
        description,
        department,
        category,
        priority,
        createdBy:user._id,
        createdByName:user.name??"Student"
    });

    await completeDraft(
        sessionId,
        ticket._id
    );

    await clearDraft(
        sessionId,
    );

    return ticket;
}

module.exports={
    createTicketFromDraft
};