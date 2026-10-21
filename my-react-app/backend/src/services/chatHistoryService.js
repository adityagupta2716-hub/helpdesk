const ChatMessage=require("../models/ChatMessage.js");
const getRecentMessages=async(
    sessionId,
    limit=10
)=>{
    return await ChatMessage.find({session:sessionId})
    .sort({createdAt:-1})
    .limit(limit)
    .lean();
};
module.exports={
    getRecentMessages
};