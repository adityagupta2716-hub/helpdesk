import api from "../../services/api";
export const loginUser=async(loginData)=>{
    const response=await api.post(
        "/auth/login",
        loginData
    );
    return response.data;
};
export const getProfile=async()=>{
    const token=localStorage.getItem("token");
    const response=await api.get(
        "/users/profile",
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const updateProfile=async(profileData)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        "/users/profile",
        profileData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const changePassword=async(passwordData)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(
        "/users/change-password",
        passwordData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};