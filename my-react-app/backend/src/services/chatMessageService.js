const ChatMessage=require("../models/ChatMessage.js");
const saveMessage=async(
    sessionId,
    sender,
    content,
    {
        metadata={},
        ui=[]
    }={}
)=>{
    return await ChatMessage.create({
        session:sessionId,
        sender,
        content,
        metadata,
        ui
    });
};
module.exports={
    saveMessage
};