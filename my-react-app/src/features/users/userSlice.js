import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import {
    getStaffUsers,
    getAllUsers,
    createUser,
    updateUser
 } from "./userAPI.js";
export const fetchStaffUsers=createAsyncThunk("users/fetchStaffUsers",
    async(_,thunkAPI)=>{
        try{
            return await getStaffUsers();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch staff users"
            );
        }
    }
);
export const fetchAllUsers=createAsyncThunk("users/fetchAllUsers",
    async(_,thunkAPI)=>{
        try{
            return await getAllUsers();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch all users"
            );
        }
    }
);
export const createUserThunk=createAsyncThunk("users/createUserThunk",
    async(userData,thunkAPI)=>{
        try{
            return await createUser(userData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to create user"
            );
        }
    }
);
export const updateUserThunk=createAsyncThunk("users/updateUser",
    async({
        userId,
        userData
    },thunkAPI)=>{
        try{
            return await updateUser(
                userId,
                userData
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update error"
            );
        }
    }
);
const initialState={
    users:[],
    staffUsers:[],
    loading:false,
    error:null
};
const userSlice=createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchStaffUsers.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchStaffUsers.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.staffUsers=action.payload.staffUsers;
            }
        );
        builder.addCase(
            fetchStaffUsers.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchAllUsers.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchAllUsers.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.users=action.payload.users;
            }
        );
        builder.addCase(
            fetchAllUsers.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            createUserThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            createUserThunk.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );
         builder.addCase(
            createUserThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            updateUserThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=false;
            }
        );
         builder.addCase(
            updateUserThunk.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );
         builder.addCase(
            updateUserThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        
    
    }})
export default userSlice.reducer;