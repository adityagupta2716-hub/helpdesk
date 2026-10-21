import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import {
    connectSocket,
    disconnectSocket
} from "../../socket/SocketClient";
import {
    loginUser,
    getProfile,
    updateProfile,
    changePassword
} from "./authAPI";
const token=localStorage.getItem("token");
const user=JSON.parse(localStorage.getItem("user"));
export const login=createAsyncThunk(
    "auth/login",
    async(loginData,thunkAPI)=>{
        try{
            return await loginUser(loginData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Login failed"
            );
        }
    }
);
export const fetchProfile=createAsyncThunk("auth/fetchProfile",
    async(_,thunkAPI)=>{
        try{
            return await getProfile();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch profile"
            );
        }
    }
);
export const updateUserProfile=createAsyncThunk("auth/updateProfile",
    async(profileData,thunkAPI)=>{
        try{
            return await updateProfile(profileData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    }
);
export const changeUserPassword=createAsyncThunk("auth/changePassword",
    async(passwordData,thunkAPI)=>{
        try{
            return await changePassword(passwordData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Password change failed"
            );
        }
    }
);
const initialState={
    user:user || null,
    token:token||null,
    isAuthenticated:!!token,
    loading:false,
    error:null
};
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.token=null;
            state.isAuthenticated=false;
            state.error=null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            disconnectSocket();
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            login.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            login.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.user=action.payload.user;
                state.token=action.payload.token;
                state.isAuthenticated=true;
                localStorage.setItem(
                    "token",
                    action.payload.token
                );
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        action.payload.user
                    )
                );
                connectSocket(action.payload.token);
            }
        );
        builder.addCase(
            login.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchProfile.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchProfile.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.user=action.payload;
            }
        );
        builder.addCase(
            fetchProfile.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            updateUserProfile.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            updateUserProfile.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.user=action.payload.user;
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );
            }
        );
        builder.addCase(
            updateUserProfile.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            changeUserPassword.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            changeUserPassword.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );
        builder.addCase(
            changeUserPassword.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
    }
    
});
export const{
    logout
}=authSlice.actions;
export default authSlice.reducer;
