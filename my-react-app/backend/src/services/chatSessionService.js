const ChatSession=require("../models/ChatSessions.js");
const createSession=async(userId)=>{
    const session=await ChatSession.create({
        user:userId,
        draftStatus:null,
        activeDraft:null
    });
    return session;
};
const getOrCreateSession=async(userId,sessionId)=>{
    if(sessionId)
    {
        const existing=await ChatSession.findById(sessionId);
        if(existing)
        {
            return existing;
        }
    }
    return await createSession(userId);
};
module.exports={
    createSession,
    getOrCreateSession
};