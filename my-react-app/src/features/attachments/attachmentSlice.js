import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import {
    getAttachments,
    uploadAttachment,
    deleteAttachment
} from "./attachmentAPI.js";

export const fetchAttachments=createAsyncThunk("attachments/fetchAttachments",
    async(ticketId,thunkAPI)=>{
        try{
            return await getAttachments(ticketId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch attachments"
            );
        }
    }
);

export const uploadAttachmentThunk=createAsyncThunk("attachments/uploadAttachment",
    async({ticketId,file},thunkAPI)=>{
        try{
            return await uploadAttachment(ticketId,file);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to upload attachment"
            );
        }
    }
);

export const deleteAttachmentThunk=createAsyncThunk("attachments/deleteAttachment",
    async(attachmentId,thunkAPI)=>{
        try{
            return await deleteAttachment(attachmentId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete attachment"
            );
        }
    }
);

const initialState={
    attachments:[],
    loading:false,
    uploadLoading:false,
    error:null
};

const attachmentSlice=createSlice({
    name:"attachments",
    initialState,
    reducers:{
        receiveAttachment:(state,action)=>{
            state.attachments.unshift(
                action.payload
            );
        },

        removeAttachment:(state,action)=>{
            state.attachment=state.attachments.filter(
                attachment=>attachment._id!==action.payload
            );
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            fetchAttachments.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchAttachments.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.attachments=action.payload.attachments;
            }
        );
        builder.addCase(
            fetchAttachments.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            uploadAttachmentThunk.pending,
            (state)=>{
                state.uploadLoading=true;
                state.error=null;
            }
        );
        builder.addCase(
            uploadAttachmentThunk.fulfilled,
            (state,action)=>{
                state.uploadLoading=false;
                state.attachments.unshift(action.payload.attachment);
            }
        );
        builder.addCase(
            uploadAttachmentThunk.rejected,
            (state,action)=>{
                state.uploadLoading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            deleteAttachmentThunk.fulfilled,
            (state,action)=>{
                state.attachments=state.attachments.filter(
                    attachment=>attachment._id!==action.payload.attachmentId
                );
            }
        );
        
    }
});

export const {
    receiveAttachment,
    removeAttachment
}=attachmentSlice.actions;

export default attachmentSlice.reducer;