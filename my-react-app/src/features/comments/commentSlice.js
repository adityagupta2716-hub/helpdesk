import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import {
    getComments,
    addComment,
    deleteComment
} from "./commentAPI.js";

export const fetchComments=createAsyncThunk("comments/fetchComments",
    async(ticketId,thunkAPI)=>{
        try{
            return await getComments(ticketId);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch comments"
            );
        }
    }
);

export const addCommentThunk=createAsyncThunk("comments/addComment",
    async({ticketId,commentData},thunkAPI)=>{
        try{
            return await addComment(ticketId,commentData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        }
    }
);

export const deleteCommentThunk=createAsyncThunk("comments/deleteComment",
    async(commentId,thunkAPI)=>{
        try{
            return await deleteComment(commentId);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    }
);

const initialState={
    comments:[],
    loading:false,
    error:null
};

const commentSlice=createSlice({
    name:"comments",
    initialState,
    reducers:{
        receiveComment(state,action)
        {
            const exists=state.comments.some(
                c=>c._id===action.payload._id
            );
            if(!exists)
            {
                state.comments.push(action.payload);
            }
        },

        removeComment(state,action)
        {
            state.comments=state.comments.filter(
                c=>c._id!==action.payload
            );
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            fetchComments.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchComments.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.comments=action.payload.comments;
            }
        );
        builder.addCase(
            fetchComments.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            addCommentThunk.fulfilled,
            (state,action)=>{
                state.comments.push(action.payload.comment);
            }
        );
        builder.addCase(
            addCommentThunk.rejected,
            (state,action)=>{
                state.error=action.payload;
            }
        );
        builder.addCase(
            deleteCommentThunk.fulfilled,
            (state,action)=>{
                state.comments=state.comments.filter(
                    comment=>comment._id!==action.payload.commentId
                );
            }
        );
    }
});

export const {
    receiveComment,
    removeComment   
}=commentSlice.actions;
export default commentSlice.reducer;
