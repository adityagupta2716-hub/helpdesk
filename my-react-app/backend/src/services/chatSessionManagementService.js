const ChatSession=require("../models/ChatSessions.js");
const ChatMessage=require("../models/ChatMessage.js");

const getUserSessions=async(userId)=>{
    return await ChatSession.find({user:userId}).sort({updatedAt:-1});
};

const getSessionMessages=async(sessionId,userId)=>{
    const session=await ChatSession.findOne({
        _id:sessionId,
        user:userId
    });

    if(!session)
    {
        return null;
    }
    return await ChatMessage.find({
        session:sessionId
    }).sort({createdAt:1});
};

const renameSession=async(
    sessionId,
    userId,
    title
)=>{
    return await ChatSession.findOneAndUpdate(
        {
            _id:sessionId,
            user:userId
        },
        {
            title
        },
        {
            new:true
        }
    );
}

const deleteSession=async(
    sessionId,
    userId
)=>{
    const session=await ChatSession.findOne({
        _id:sessionId,
        user:userId
    });
    if(!session)
    {
        return false;
    }
    await ChatMessage.deleteMany({
        session:sessionId
    });

    await ChatSession.findByIdAndDelete(
        sessionId
    );
    return true;
};

module.exports={
    getUserSessions,
    getSessionMessages,
    renameSession,
    deleteSession
};