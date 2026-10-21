import api from "../../services/api.js";
export const getComments=async(ticketId)=>{
    const token=localStorage.getItem("token");
    const response=await api.get(
        `/comments/${ticketId}`,
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
}
export const addComment=async(ticketId,commentData)=>{
    const token=localStorage.getItem("token");
    const response=await api.post(
        `/comments/${ticketId}`,
        commentData,
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
}

export const deleteComment=async(commentId)=>{
    const token=localStorage.getItem("token");
    const response=await api.delete(`/comments/${commentId}`,
    {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};