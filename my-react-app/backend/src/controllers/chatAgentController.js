const CampusAgent=require("../services/ai/agent/CampusAgent.js");
const AgentContext=require("../services/ai/agent/AgentContext.js");
const {
    getOrCreateSession
}=require("../services/chatSessionService.js");
const{
    getRecentMessages
}=require("../services/chatHistoryService.js");
const{
    getActiveDraft
}=require("../services/chatDraftService.js");
const{
    saveMessage
}=require("../services/chatMessageService.js");

async function askChatAgent(req,res)
{
    try
    {
        const {message}=req.body;
        if(
            !message ||
            typeof message !=="string" ||
            !message.trim()
        )
        {
            return res.status(400).json({
                message:"Message is required"
            });
        }

        const session=await getOrCreateSession(
            req.user._id,
            req.body.sessionId
        );

        const history=await getRecentMessages(
            session._id
        );

        const activeDraft=await getActiveDraft(
            session._id
        );

        await saveMessage(
            session._id,
            "user",
            message
        );

        if(session.title==="New Conversation")
        {
            session.title=message.substring(0,40);
            await session.save();
        }

        //Agent context

        const context=new AgentContext({
            user:req.user,
            session,
            request:req,
            response:res,
            activeDraft,
            history
        });

        //Calling the agent

        const agent=new CampusAgent();
        const result = await agent.run({
            message,
            history,
            context
        });

        console.log("\n========== UI ==========");
        console.dir(result.ui, {
            depth: null,
            colors: true
        });

        await saveMessage(
            session._id,
            "assistant",
            result.response,
            {
                metadata:{
                    confidence:result.confidence,
                    suggestTicket:result.suggestTicket
                },
                ui:result.ui ?? []
            }
        );

        return res.status(200).json({
            success:result.success,
            sessionId:session._id,
            session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
            },
            response:result.response,
            ui:result.ui??[]
        });

    }
    catch(error)
    {
        console.error(
            "CHAT AGENT ERROR"
        );
        console.error(error);
        return res.status(500).json({
            message:error.message
        });
    }
}

module.exports={
    askChatAgent
};