import api from "../../services/api";

export const getFAQs=async()=>{
    const token=localStorage.getItem("token");

    const response=await api.get(
        "/knowledge-base",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const createFAQ=async(faqData)=>{
    const token=localStorage.getItem("token");

    const response=await api.post(
        "/knowledge-base",
        faqData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const updateFAQ=async(
    faqId,
    faqData
)=>{
    const token=localStorage.getItem("token");

    const response=await api.put(
        `/knowledge-base/${faqId}`,
        faqData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};
export const deleteFAQ=async(faqId)=>{
    const token=localStorage.getItem("token");
    const response=await api.delete(`/knowledge-base/${faqId}`,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    );
    return response.data;
}