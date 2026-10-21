import api from "../../services/api.js";
export const getTimeline=async(ticketId)=>{
    const token=localStorage.getItem("token");
    const response=await api.get(`/tickets/${ticketId}/timeline`,
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};