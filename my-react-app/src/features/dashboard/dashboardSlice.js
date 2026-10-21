import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import {
    getStudentDashboard,
    getStaffDashboard,
    getAdminDashboard
} from "./dashboardAPI.js";
export const fetchStudentDashboard=
createAsyncThunk("dashboard/fetchStudentDashboard",
    async(_,thunkAPI)=>{
        try{
            return await getStudentDashboard();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch dashboard"
            );
        }
    }
);
const initialState={
    dashboardData:null,
    loading:false,
    error:null
};

export const fetchStaffDashboard=createAsyncThunk(
    "dashboard/fetchStaffDashboard",
    async(_,thunkAPI)=>{
        try{
            return await getStaffDashboard();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch staff dashboard"
            );
        }
    }
);
export const fetchAdminDashboard=createAsyncThunk(
    "dashboard/fetchAdminDashboard",
    async(_,thunkAPI)=>{
        try{
            return await getAdminDashboard();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch admin dashboard"
            )
        }
    }
);

const dashboardSlice=createSlice({
    name:"dashboard",
    initialState,
    reducres:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchStudentDashboard.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchStudentDashboard.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.dashboardData=action.payload;
            }
        );
        builder.addCase(
            fetchStudentDashboard.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchStaffDashboard.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchStaffDashboard.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.dashboardData=action.payload;
            }
        );
        builder.addCase(
            fetchStaffDashboard.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchAdminDashboard.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchAdminDashboard.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.dashboardData=action.payload;
            }
        );
        builder.addCase(
            fetchAdminDashboard.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );

    }
});
export default dashboardSlice.reducer;