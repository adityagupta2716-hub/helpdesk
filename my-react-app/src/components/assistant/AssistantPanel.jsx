import ChatMessage from "./ChatMessage.jsx";
import PopularQuestions from "./PopularQuestions.jsx";

import { useState, useRef, useEffect } from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    sendMessageThunk,
    fetchSessionThunk,
    fetchMessagesThunk,
    setCurrentSession,
    addUserMessage,
    addAssistantMessage,
    startNewChat,
    insertSession,
    deleteSessionThunk,
    clearChatState,
    clearMessages
} from "../../features/chatbot/chatbotSlice.js";

function AssistantPanel({ role })
{
    const dispatch=useDispatch();
    const {
        loading,
        sessions,
        messages,
        currentSessionId
    }=useSelector(state=>state.chatbot);
    const[input,setInput]=useState("");
    const initialized=useRef(false);
    const messagesEndRef=useRef(null);
    useEffect(()=>{
        dispatch(clearChatState());
        dispatch(fetchSessionThunk());
    },[
        dispatch
    ]);
    useEffect(()=>{
        if(initialized.current)
        {
            return;
        }
        if(sessions.length===0)
        {
            dispatch(clearMessages());
            return;
        }
        initialized.current=true;
        const latestSession=sessions[0];
        dispatch(setCurrentSession(latestSession._id));
        dispatch(fetchMessagesThunk(latestSession._id));
    },[
        sessions,
        dispatch
    ]);
    useEffect(()=>{
        if(!currentSessionId)
        {
            dispatch(clearMessages());
            return;
        }
        dispatch(fetchMessagesThunk(currentSessionId));
    },[
        currentSessionId,
        dispatch
    ]);
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior:"smooth"
        });
    },[messages]);
    async function sendMessage(messageText){
        if(loading)
        {
            return;
        }
        if(!messageText.trim())
        {
            return;
        }
        dispatch(
            addUserMessage({
                _id:Date.now(),
                sender:"user",
                content:messageText
            })
        );

        const result=await dispatch(sendMessageThunk({
            message:messageText,
            sessionId:currentSessionId
        }));
        console.log("CHATBOT RESULT", result);
        

        if(result.type==="chatbot/sendMessage/fulfilled")
        {
            if(result.payload?.sessionId && !currentSessionId)
            {
                dispatch(
                    setCurrentSession(result.payload.sessionId)
                );
                console.log("Returned Session:",result.payload.session);
                dispatch(insertSession(result.payload.session));
            }
            dispatch(
                addAssistantMessage({
                    _id:Date.now()+1,
                    sender:"assistant",
                    content:result.payload.response,
                    metadata:{
                        confidence:result.payload.confidence,
                        suggestTicket:result.payload.suggestTicket
                    },
                    faq:result.payload.faq,
                    ticketDraft:result.payload.ticketDraft,
                    ui:result.payload.ui ?? []
                })
            );
        }
        else
        {
            dispatch(
                addAssistantMessage({
                    _id:Date.now()+1,
                    sender:"assistant",
                    content:"Sorry, I encountered an error while processing your request."
                })
            );
        }
    }
    function handleSend(){
        sendMessage(input);
        setInput("");
    }

    return (
            <div className="grid grid-cols-4 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow p-4 overflow-y-auto h-[550px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">
                            Conversations
                        </h2>
                        <button
                        onClick={()=>{
                            console.log("NEW CHAT CLICKED");
                            dispatch(startNewChat());
                        }}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                            + New
                        </button>
                    </div>
                    <div className="space-y-2">
                        {sessions.map(session=>(
                            <div
                            key={session._id}
                            className={`flex justify-between items-start p-3 rounded-lg transition min-h-[80px]
                            ${currentSessionId===session._id?"bg-blue-100 border-blue-300":"border-gray-200 hover:bg-gray-50"}`}>
                                <div
                                className="flex-1 cursor-pointer overflow-hidden pr-3"
                                onClick={()=>{
                                    dispatch(setCurrentSession(session._id));
                                }}>
                                    <p className="font-medium text-sm line-clamp-2">
                                        {session.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                            {new Date(
                                                session.updatedAt).toLocaleDateString()
                                            }
                                    </p>
                                </div>
                                    <button
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        const confirmed=window.confirm("Delete this conversation?");
                                        if(!confirmed)
                                        {
                                            return;
                                        }
                                        dispatch(deleteSessionThunk(session._id));
                                    }}
                                    className="flex-shrink-0 self-start text-gray-400 hover:text-red-600 transition"
                                    >
                                    🗑️
                                    </button>
                                
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-xl shadow p-6 h-[500px]">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-4 overflow-y-auto">
                                {messages.map((message)=>(
                                    <ChatMessage 
                                    key={message._id} 
                                    sender={message.sender} 
                                    text={message.content}
                                    confidence={message.metadata?.confidence} 
                                    suggestTicket={message.metadata?.suggestTicket} 
                                    ticketDraft={message.ticketDraft} 
                                    faq={message.faq} 
                                    ui={message.ui}
                                    role={role}/>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-xl px-4 py-3">
                                            Thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef}></div>
                            </div>
                            <div className="border-t pt-4 flex gap-3">
                                <input type="text" id="message" name="message" placeholder="Type your message..." value={input} onChange={(e)=>setInput(e.target.value)} className="flex-1 border rounded-lg p-3"
                                onKeyDown={(e)=>{
                                    if(e.key==="Enter"&& !loading)
                                    {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}/>
                                <button disabled={loading} onClick={handleSend} className="bg-blue-600 text-white px-5 rounded-lg">
                                    {loading?"Thinking...":"Send"}
                                   
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <PopularQuestions onQuestionClick={sendMessage} role={role}/>
                </div>
            </div>
    )
    
}

export default AssistantPanel;