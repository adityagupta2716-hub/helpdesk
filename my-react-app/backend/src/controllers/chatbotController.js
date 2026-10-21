const {
    findBestFaq
}=require("../services/chatbotService.js");
const {
    generateResponse
}=require("../services/geminiService.js");
const {
    detectSmallTalk
}=require("../services/chatPreprocessorService.js");
const {
    analyzeIntent
}=require("../services/intentAnalysisService.js");
const {
    getOrCreateSession
}=require("../services/chatSessionService.js");
const {
    saveMessage
}=require("../services/chatMessageService.js");
const
{
    getRecentMessages
}=require("../services/chatHistoryService.js");
const{
    saveDraft,
    getActiveDraft,
    updateDraft,
    completeDraft,
    clearDraft
}=require("../services/chatDraftService.js");
const{
    getUserSessions,
    getSessionMessages,
    renameSession,
    deleteSession
}=require("../services/chatSessionManagementService.js");
const {
    detectConfirmation
}=require("../services/chatConfirmationService.js");
const CampusAgent=require("../services/ai/agent/CampusAgent.js");
const AgentContext=require("../services/ai/agent/AgentContext.js");
const askChatbot=async(req,res)=>{
    try{
        const {message}=req.body;
        console.log(req.user);
        if(!message)
        {
            return res.status(400).json({
                message:"Message is required",
            });
        }
        const {sessionId}=req.body;
        console.log("REQUEST SESSION ID:",sessionId);
        const session=await getOrCreateSession(
            req.user._id,
            sessionId
        );
        const recentMessages=await getRecentMessages(
            session._id
        );
        const activeDraft=await getActiveDraft(
            session._id
        );
        
        const isConfirmation=detectConfirmation(message);
        console.log(
            "ACTIVE DRAFT EXISTS:",
            !!activeDraft
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
        const smallTalk=detectSmallTalk(message);
        if(smallTalk.isSmallTalk)
        {
            await saveMessage(
                session._id,
                "assistant",
                smallTalk.response
            );

            return res.status(200).json({
                found:true,
                sessionId:session._id,
                response:smallTalk.response
            });
        }
        const intentResult=await analyzeIntent(
            message,
            recentMessages
        );
        console.log("CONTROLLER INTENT RESULT",intentResult);
        console.log(
            "[Intent]",JSON.stringify(intentResult,null,2)
        );
        if(
            activeDraft &&
            activeDraft.confirmationPending &&
            isConfirmation
        )
        {
            const agent=new CampusAgent();
            const context=new AgentContext({
                user:req.user,
                session,
                request:req,
                response:res,
                intent:intentResult,
                activeDraft
            });
        }
        if(intentResult.intent==="out_of_scope")
        {
            await saveMessage(
                session._id,
                "assistant",
                "I'm designed only to help with campus support..."
            );
            return res.status(200).json({
                found:false,
                sessionId:session._id,
                session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
                },
                intent:"out_of_scope",
                response:"I'm designed only to help with campus support, student services, hostel, transport, accounts, library and IT related queries."
            });
        }
        if(intentResult.intent==="needs_review")
        {
            await saveMessage(
                session._id,
                "assistant",
                "Could you provide a little more information so I can understand your request better?"
            );
            return res.status(200).json({
                found:false,
                sessionId:session._id,
                session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
                },
                intent:"needs_review",
                response:
                "Could you provide a little more information so I can understand your request better?"
            });
        }
        if(intentResult.intent==="issue")
        {
            
            const result=await findBestFaq(message);
            if(result && (result.confidence==="high" || result.confidence==="medium"))
            {
                const aiResponse=await generateResponse(message,result.topMatches,recentMessages);
                await saveMessage(
                    session._id,
                    "assistant",
                    aiResponse,
                    {
                        confidence:result.confidence,
                        suggestTicket:true
                    }
                );
                return res.status(200).json({
                    found:true,
                    sessionId:session._id,
                    session:{
                    _id:session._id,
                    title:session.title,
                    updatedAt:session.updatedAt
                    },
                    intent:"issue",
                    solvedByKB:true,
                    response:aiResponse+"\n\nIf this does not solve your issue, I can create a ticket draft for you.",
                    suggestTicket:true,
                    confidence:result.confidence
                });
            }
            await saveMessage(
                session._id,
                "assistant",
                `This appears to be a ${intentResult.department} issue. I can create a ticket draft for you.`,
                {
                    suggestTicket:true
                }
            );
            if(intentResult.draftAction==="update" && activeDraft)
            {
                const updatedDraft=await updateDraft(
                        session._id,
                        {
                            title:intentResult.title,
                            description:intentResult.description,
                            department:intentResult.department,
                            category:intentResult.category,
                            priority:intentResult.priority
                        }
                    );
                    return res.status(200).json({
                        found:true,
                        sessionId:session._id,
                        session:{
                            _id:session._id,
                            title:session.title,
                            updatedAt:session.updatedAt
                        },
                        draftUpdated:true,
                        ticketDraft:updatedDraft,
                        response:
                        "Got it. I've updated the ticket draft."
                    });
            }
            if(intentResult.draftAction==="new")
            {
                const updatedSession=await saveDraft(
                    session._id,
                    {
                        title:intentResult.title,
                        description:intentResult.description,
                        department:intentResult.department,
                        category:intentResult.category,
                        priority:intentResult.priority
                    }
                );
                console.log(
                    "DRAFT SAVED",
                    updatedSession.activeDraft
                );
            }
            return res.status(200).json({
                found:false,
                sessionId:session._id,
                session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
                },
                intent:"issue",
                suggestTicket:true,

                ticketDraft:{
                    title:intentResult.title,
                    description:intentResult.description,
                    department:intentResult.department,
                    category:intentResult.category,
                    priority:intentResult.priority
                },
                response:
                `This appears to be a ${intentResult.department} issue. I can create a ticket draft for you.`
            });
        }
        
        const result=await findBestFaq(message);
        if(!result)
        {
            if(intentResult.intent==="informational")
            {
                await saveMessage(
                    session._id,
                    "assistant",
                    "I couldn't find this information in the knowledge base. Please contact the relevant campus office for assistance."
                );
                return res.status(200).json({
                    found:false,
                    sessionId:session._id,
                    session:{
                        _id:session._id,
                        title:session.title,
                        updatedAt:session.updatedAt
                    },
                    intent:"informational",
                    response:"I couldn't find this information in the knowledge base. Please contact the relevant campus office for assistance."
                });
            }
            await saveMessage(
                session._id,
                "assistant",
                "I couldn't find a relevant answer in the knowledge base."
            );
            return res.status(200).json({
                found:false,
                sessionId:session._id,
                session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
                },
                intent:"question",
                suggestTicket:false,
                response:"I couldn't find a relevant answer in the knowledge base."
            });
        }
        if(result.score<5)
        {
            if(intentResult.intent==="informational")
            {
                await saveMessage(
                    session._id,
                    "assistant",
                    "I am not confident enough to answer this question. Please contact the relevant campus office."
                );
                return res.status(200).json({
                    found:false,
                    sessionId:session._id,
                    session:{
                        _id:session._id,
                        title:session.title,
                        updatedAt:session.updatedAt
                    },
                    intent:"informational",
                    response:"I am not confident enough to answer this question. Please contact the relevant campus office."
                });
            }
            await saveMessage(
                session._id,
                "assistant",
                "I'm not confident enough to answer this question. Please create a support ticket so our team can assist you.",
                {
                    confidence:"low",
                    suggestTicket:true
                }
            );
            return res.status(200).json({
                found:false,
                sessionId:session._id,
                session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
                },
                intent:"question",
                suggestTicket:true,
                confidence:"low",
                response:"I'm not confident enough to answer this question. Please create a support ticket so our team can assist you."
            });
        }
        const aiResponse=await generateResponse(
            message,
            result.topMatches,
            recentMessages
        );
        await saveMessage(
                    session._id,
                    "assistant",
                    aiResponse,
                    {
                        confidence:result.confidence,
                        suggestTicket:true
                    }
        );
        let finalResponse=aiResponse;
        if(result.confidence==="medium")
        {
            finalResponse+=
            "\n\nIf this doesn't completely solve your issue, you can create a support ticket for futher assistance.";
        }
        res.status(200).json({
            found:true,
            sessionId:session._id,
            session:{
                _id:session._id,
                title:session.title,
                updatedAt:session.updatedAt
            },
            response:finalResponse,
            faq:{
                question:result.bestMatch.question,
                category:result.bestMatch.category
            },
            score:result.score,
            confidence:result.confidence,
            suggestTicket:result.confidence==="medium"
        });

    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({
            message:error.message
        });
    }
};

const getSessions=async(req,res)=>{
    try{
        const sessions=await getUserSessions(req.user._id);

        res.status(200).json(
            sessions
        );
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const getMessages=async(req,res)=>{
    try{
        const messages=await getSessionMessages(req.params.id,req.user._id);
        if(!messages)
        {
            return res.status(404).json({
                message:"Session not found"
            });
        }
        res.status(200).json(
            messages
        );
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const updateSessionTitle=async(req,res)=>{
    try{
        const session=await renameSession(req.params.id,req.user._id,req.body.title);
        if(!session)
        {
            return res.status(404).json({
                message:"Session  not found"
            });
        }
        res.status(200).json({
            session
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const removeSession=async(req,res)=>{
    try{
        const deleted=await deleteSession(req.params.id,req.user._id);
        if(!deleted)
        {
            return res.status(404).json({
                message:"Session not found"
            });
        }
        res.status(200).json({
            message:"Deleted"
        })
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports={
    askChatbot,
    getSessions,
    getMessages,
    updateSessionTitle,
    removeSession
};