
import api from "../../services/api.js";
export const getAttachments=async(ticketId)=>{
    const token=localStorage.getItem("token");
    const response=await api.get(`/attachments/${ticketId}`,
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};
export const uploadAttachment=async(ticketId,file)=>{
    const token=localStorage.getItem("token");
    const formData=new FormData();
    formData.append(
        "file",
        file
    );
    const response=await api.post(`/attachments/${ticketId}`,
        formData,
        {headers:{Authorization:`Bearer ${token}`,"Content-Type":"multipart/form-data"}}
    );
    return response.data;
};

export const deleteAttachment=async(attachmentId)=>{
    const token=localStorage.getItem("token");
    const response=await api.delete(
        `/attachments/${attachmentId}`,
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};