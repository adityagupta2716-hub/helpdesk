import api from "../../services/api.js";

const getAuthConfig=()=>({
    headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
});
export const askChatbot=async(message,sessionId)=>{
    const response=await api.post(
        "/chatbot",
        {
            message,
            sessionId
        },
        getAuthConfig()
    );
    return response.data;
};

export const getSessions=async()=>{
    const response=await api.get(
        "/chatbot/sessions",
        getAuthConfig()
    );
    return response.data
};

export const getMessages=async(sessionId)=>{
    const response=await api.get(
        `/chatbot/sessions/${sessionId}/messages`,
        getAuthConfig()
    );
    return response.data;
};

export const updateSessionTitle=async(sessionId,title)=>{
    const response=await api.put(
        `/chatbot/sessions/${sessionId}`,
        {title},
        getAuthConfig()
    );
    return response.data
};

export const deleteSession=async(sessionId)=>{
    const response=await api.delete(
        `/chatbot/sessions/${sessionId}`,
        getAuthConfig()
    );
    return response.data;
};