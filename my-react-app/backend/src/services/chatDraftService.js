const ChatSession=require("../models/ChatSessions.js");
const saveDraft=async(sessionId,draft)=>{
    return await ChatSession.findByIdAndUpdate(
        sessionId,
        {
            activeDraft:{
                ...draft,
                confirmationPending:true,
                confirmedAt:null,
                createdTicketId:null
            },
            draftStatus:"active"
        },
        {
            new:true
        }
    );
};

const getActiveDraft=async(sessionId)=>{
    const session=await ChatSession.findById(sessionId);
    if(
        session &&
        session.draftStatus==="active" &&
        session.activeDraft
    )
    {
        return session.activeDraft;
    }
    return null;
};

const updateDraft=async(
    sessionId,
    updates
)=>{
    const session=await ChatSession.findById(sessionId);
    if(!session?.activeDraft)
    {
        return null;
    }
    const mergedDraft={
        ...session.activeDraft,
        ...updates,
        confirmationPending:true,
        confirmedAt:null,
        createdTicketId:null
    };
    session.activeDraft=mergedDraft;
    await session.save();
    return session.activeDraft;
};

const completeDraft=async(
    sessionId,
    ticketId
)=>{
    return await ChatSession.findByIdAndUpdate(
        sessionId,
        {
            draftStatus:"completed",
            "activeDraft.confirmationPending":false,
            "activeDraft.confirmedAt":new Date(),
            "activeDraft.createdTicketId":ticketId
        },
        {
            new:true
        }
    );
};

const clearDraft=async(sessionId)=>{
    return await ChatSession.findByIdAndUpdate(
        sessionId,
        {
            activeDraft:null,
            draftStatus:null
        },
        {
            new:true
        }
    );
};

module.exports={
    saveDraft,
    getActiveDraft,
    updateDraft,
    completeDraft,
    clearDraft
};