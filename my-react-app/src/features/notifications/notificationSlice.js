import{
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "./notificationAPI";

export const fetchNotifications=createAsyncThunk("notifications/fetchNotifications",
    async(_,thunkAPI)=>{
        try{
            return await getNotifications();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch notifications"
            );
        }
    }
);

export const markAsRead=createAsyncThunk("notifcations/markAsRead",
    async(notificationId,thunkAPI)=>{
        try{
            await markNotificationRead(notificationId);
            return notificationId;
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to mark notification"
            );
        }
    }
);

export const markAllAsReadThunk=createAsyncThunk(
    "notifications/markAllAsRead",
    async(_,thunkAPI)=>{
        try{
            await markAllNotificationsRead();
            return true;
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to mark all notifications"
            );
        }
    }
);
const initialState={
    notifications:[],
    loading:false,
    error:null
};

const notificationSlice=createSlice({
    name:"notifications",
    initialState,
    reducers:{
        receiveNotification:(state,action)=>{
            state.notifications.unshift(
                action.payload
            );
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            fetchNotifications.pending,
            (state)=>{state.loading=true;}
        );
        builder.addCase(
            fetchNotifications.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.notifications=action.payload.notifications;
            }
        );
        builder.addCase(
            fetchNotifications.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            markAsRead.fulfilled,
            (state,action)=>{
                const notification=state.notifications.find(
                    n=>n._id===action.payload);
                if(notification)
                {
                    notification.isRead=true;
                }
            }
        );
        builder.addCase(
            markAllAsReadThunk.fulfilled,
            (state)=>{
                state.notifications.forEach(
                    notification=>{
                        notification.isRead=true;
                    }
                );
            }
        );
        

    }
});
export const {
    receiveNotification
}=notificationSlice.actions;
export default notificationSlice.reducer