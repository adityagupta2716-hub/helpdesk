import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import {
    getTimeline
} from "./timelineAPI.js";

export const fetchTimeline=createAsyncThunk("timeline/fetchTimeline",
    async(ticketId,thunkAPI)=>{
        try{
            return await getTimeline(ticketId);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch timeline"
            );
        }
    }
);

const initialState={
    timeline:[],
    loading:false,
    error:null
};

const timelineSlice=createSlice({
    name:"timeline",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchTimeline.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchTimeline.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.timeline=action.payload.timeline;
            }
        );
        builder.addCase(
            fetchTimeline.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
    }
});

export default timelineSlice.reducer;