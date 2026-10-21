
import api from "../../services/api";
export const getMyTickets=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/tickets/my",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return response.data;
};
export const getTicketById=async(ticketId)=>{
    const token=localStorage.getItem("token");
    const response=await api.get(`/tickets/${ticketId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return response.data;
};
export const createTicket=async(ticketData)=>{
    const token=localStorage.getItem("token");
    const response =await api.post("/tickets",ticketData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return response.data;
};
export const getAssignedTickets=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/tickets/assigned",
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const updateTicketStatus=async(ticketId,status)=>
{
    const token=localStorage.getItem("token");
    const response=await api.put(`/tickets/${ticketId}/status`,
        {status},
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const updateResolutionNotes=async(ticketId,resolutionNotes)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(`/tickets/${ticketId}/resolution`,
        {resolutionNotes},
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const getAllTickets=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/tickets",
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};
export const assignTicket=async(ticketId,staffId,reason="")=>{
    const token=localStorage.getItem("token");
    const response=await api.put(`/tickets/${ticketId}/assign`,
        {staffId,reason},
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const editTicket=async(ticketId,ticketData)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        `/tickets/${ticketId}`,
        ticketData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const cancelTicket=async(ticketId,reason)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        `/tickets/${ticketId}/cancel`,
        {
            reason
        },
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const adminCancelTicket = async (
    ticketId,
    reason
) => {

    const token = localStorage.getItem("token");

    const response = await api.put(
        `/tickets/${ticketId}/admin-cancel`,
        {
            reason
        },
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const approveTicket=async(ticketId,reviewNotes)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        `/tickets/${ticketId}/approve`,
        {
            reviewNotes
        },
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const rejectTicket=async(ticketId,reviewNotes)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        `/tickets/${ticketId}/reject`,
        {
            reviewNotes
        },
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const reassignTicket = async(ticketId, staffId, reason)=>{
    const token=localStorage.getItem("token");

    const response=await api.put(
        `/tickets/${ticketId}/reassign`,
        {
            staffId,
            reason
        },
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};