
import api from "../../services/api.js";
export const getStudentDashboard=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get(
        "/dashboard/student",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );
    return response.data;
}
export const getStaffDashboard=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get(
        "/dashboard/staff",
    {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    return response.data;
};
export const getAdminDashboard=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/dashboard/admin",
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};