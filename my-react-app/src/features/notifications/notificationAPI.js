import api from "../../services/api";
export const getNotifications=async()=>
{
    const token=localStorage.getItem("token");
    const response=await api.get("/notifications",
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data
};

export const markNotificationRead=async(notificationId)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(`/notifications/${notificationId}/read`,
        {},
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};

export const markAllNotificationsRead=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        "/notifications/read-all",
        {},
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};