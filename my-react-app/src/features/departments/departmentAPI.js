import api from "../../services/api";

export const getDepartments=async()=>{
    const token=localStorage.getItem("token");

    const response=await api.get(
        "/departments",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};
export const createDepartment=async(
    departmentData
)=>{
    const token=localStorage.getItem("token");
    const response=await api.post("/departments",departmentData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};
export const updateDepartment=async(
    departmentId,
    departmentData
)=>{
    const token=localStorage.getItem("token");
    const response=await api.put(`/departments/${departmentId}`,departmentData,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
};