import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import{
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
} from "./knowledgeBaseAPI.js";

export const fetchFAQs=createAsyncThunk("knowledgeBase/fetchFAQs",
    async(_,thunkAPI)=>{
        try{
            return await getFAQs();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch FAQs"
            );
        }
    }
);
export const addFAQ=
createAsyncThunk(
    "knowledgeBase/addFAQ",
    async(faqData,thunkAPI)=>{
        try{
            return await createFAQ(
                faqData
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create FAQ"
            );
        }
    }
);
export const updateFAQThunk=
createAsyncThunk(
    "knowledgeBase/updateFAQ",
    async(
        {
            faqId,
            faqData
        },
        thunkAPI
    )=>{
        try{
            return await updateFAQ(
                faqId,
                faqData
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update FAQ"
            );
        }
    }
);
export const deleteFAQThunk=createAsyncThunk("knowledgeBase/deleteFAQ",
    async(faqId,thunkAPI)=>{
        try{
            await deleteFAQ(faqId);
            return faqId;
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete FAQ"
            );
        }
    }
);
const initialState={
    faqs:[],
    loading:false,
    error:null
};

const knowledgeBaseSlice=createSlice({
    name:"knowledgeBase",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchFAQs.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchFAQs.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.faqs=action.payload.faqs;
            }
        );
        builder.addCase(
            fetchFAQs.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            addFAQ.fulfilled,
            (state,action)=>{
                state.faqs.unshift(action.payload.faq);
            }
        );
        builder.addCase(
            updateFAQThunk.fulfilled,
            (state,action)=>{
                const index=
                state.faqs.findIndex(
                    faq=>
                        faq._id===
                    action.payload.faq._id
                );
                if(index!==-1)
                {
                    state.faqs[index]=action.payload.faq;
                }
            }
        );
        builder.addCase(
            deleteFAQThunk.fulfilled,
            (state,action)=>{
                state.faqs=state.faqs.filter(faq=>faq._id!==action.payload);
            }
        );


    }});

export default knowledgeBaseSlice.reducer;