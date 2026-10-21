import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import {
    askChatbot,
    getSessions,
    getMessages,
    deleteSession,
    updateSessionTitle
} from "./chatbotAPI.js";

export const sendMessageThunk=createAsyncThunk("chatbot/sendMessage",
    async({message,sessionId},thunkAPI)=>{
        try{
            return await askChatbot(message,sessionId);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to get chatbot response"
            );
        }
    }
);

export const fetchSessionThunk=createAsyncThunk("chatbot/fetchSessions",
    async(_,thunkAPI)=>{
        try{
            return await getSessions();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sessions"
            );
        }
    }
);

export const fetchMessagesThunk=createAsyncThunk(
    "chatbot/fetchMessages",
    async(sessionId,thunkAPI)=>{
        try{
            return await getMessages(sessionId);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load messages"
            );
        }
    }
);

export const deleteSessionThunk=createAsyncThunk("chatbot/deleteSession",
    async(sessionId,thunkAPI)=>{
        try{
            await deleteSession(sessionId);
            return sessionId;
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete conversation"
            );
        }
    }
);

const initialState={
    sessions:[],
    messages:[],
    currentSessionId:null,

    loading:false,
    error:null
};

const chatbotSlice=createSlice({
    name:"chatbot",
    initialState,
    reducers:{
        setCurrentSession:(state,action)=>{
            state.currentSessionId=action.payload;
        },
        addUserMessage:(state,action)=>{
            state.messages.push(action.payload);
        },
        addAssistantMessage:(state,action)=>{
            state.messages.push(action.payload);
        },
        insertSession:(state,action)=>{
            console.log("Current sessions:", state.sessions);
            console.log("Incoming session:",action.payload);
            const exists=state.sessions.some(session=>{
                console.log("Checking session:",session);
                return session?._id===action.payload._id;
            });
            if(exists)
            {
                return;
            }
            state.sessions.unshift(action.payload);
        },
        clearMessages:(state)=>{
            state.messages=[];
        },
        startNewChat:(state)=>{
            state.currentSessionId=null;
            state.messages=[
                {
                    _id:"Welcome",
                    sender:"assistant",
                    content:"Hello!, I'm the AI Campus Assistant. How can I help you today?"
                }
            ];
        },
        clearChatState:(state)=>{
            state.sessions=[];
            state.messages=[];
            state.currentSessionId=null;
            state.loading=false;
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            sendMessageThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            sendMessageThunk.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );
        builder.addCase(
            sendMessageThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchSessionThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchSessionThunk.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.sessions=action.payload;
            }
        );
        builder.addCase(
            fetchSessionThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchMessagesThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchMessagesThunk.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.messages=action.payload;
            }
        );
        builder.addCase(
            fetchMessagesThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            deleteSessionThunk.fulfilled,
            (state,action)=>{
                state.sessions=state.sessions.filter(session=>session._id!==action.payload);
                if(state.currentSessionId===action.payload)
                {
                    if(state.sessions.length>0)
                    {
                        state.currentSessionId=state.sessions[0]._id;
                    }
                    else
                    {
                        state.currentSessionId=null;
                        state.messages=[
                            {
                                _id:"welcome",
                                sender:"assistant",
                                content:"Hello! I'm the AI Campus Assistant. How can I help you today?"
                            }
                        ];
                    }
                }
            }
        );

    }
});
export const {
    setCurrentSession,
    addUserMessage,
    addAssistantMessage,
    insertSession,
    clearMessages,
    startNewChat,
    clearChatState
}=chatbotSlice.actions;
export default chatbotSlice.reducer;