import api from "../../services/api.js";
export const getStaffUsers=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/users/staff",
        {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
};
export const getAllUsers=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get("/users",
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const createUser=async(userData)=>{
    const token=localStorage.getItem("token");
    const response=await api.post("/users",
        userData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const updateUser=async(userId,userData)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(`/users/${userId}`,
        userData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
}