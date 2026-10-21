import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import { getMyTickets, getTicketById, createTicket,getAssignedTickets,updateTicketStatus, updateResolutionNotes, getAllTickets,assignTicket,editTicket,cancelTicket, approveTicket, rejectTicket, reassignTicket, adminCancelTicket } from "./ticketAPI";
export const fetchMyTickets=createAsyncThunk("tickets/fetchMyTickets",
    async(_,thunkAPI)=>{
        try{
            return await getMyTickets();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch tickets"
            );
        }
    }
);

export const fetchAssignedTickets=createAsyncThunk("tickets/fetchAssignedTickets",
    async(_,thunkAPI)=>{
        try{
            return await getAssignedTickets();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch assigned tickets"
            );
        }
    }
);

export const fetchTicketById=createAsyncThunk("tickets/fetchTicketById",
    async(ticketId,thunkAPI)=>{
        try{
            return await getTicketById(
                ticketId
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to fetch ticket"
            );
        }
    }
);
export const createNewTicket=createAsyncThunk("tickets/createTicket",
    async(ticketData,thunkAPI)=>{
        try{
            return await createTicket(ticketData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to create ticket"
            );
        }
    }
);
export const updateStatus=createAsyncThunk("tickets/updateStatus",
    async({ticketId,status},thunkAPI)=>{
        try{
            return await updateTicketStatus(ticketId,status);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to update status"
            );
        }
    }
);
export const saveResolutionNotes=createAsyncThunk("tickets/saveResolutionNotes",
    async({ticketId,resolutionNotes},thunkAPI)=>{
        try{
            return await updateResolutionNotes(ticketId,resolutionNotes);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to save resolution notes"
            );
        }
    }
);
export const fetchAllTickets=createAsyncThunk("tickets/fetchAllTickets",
    async(_,thunkAPI)=>{
        try{
            return await getAllTickets();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch tickets"
            );
        }
    }
);
export const assignTicketToStaff=createAsyncThunk("tickets/assignTicket",
    async({ticketId,staffId,reason},thunkAPI)=>{
        try{
            return await assignTicket(ticketId,staffId,reason);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message||
                "Failed to assign ticket"
            );
        }
    }
);

export const reassignTicketThunk=createAsyncThunk(
    "tickets/reassignTicket",
    async(
        {
            ticketId,
            staffId,
            reason
        },
        thunkAPI
    )=>{
        try{
            return await reassignTicket(
                ticketId,
                staffId,
                reason
            );
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to reassign ticket"
            );
        }
    }
);

export const editTicketThunk=createAsyncThunk(
    "tickets/editTicket",
    async(
        {
            ticketId,
            ticketData
        },
        thunkAPI
    )=>{
        try{
            return await editTicket(ticketId,ticketData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update ticket"
            );
        }
    }
);
export const cancelTicketThunk=createAsyncThunk(
    "tickets/cancelTicket",
    async({
        ticketId,
        reason
    },thunkAPI)=>{
        try{
            return await cancelTicket(ticketId,reason);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to cancel ticket"
            );
        }
    }
);

export const adminCancelTicketThunk=createAsyncThunk(
    "tickets/adminCancelTicket",

    async(
        {
            ticketId,
            reason
        },
        thunkAPI
    )=>{

        try{

            return await adminCancelTicket(
                ticketId,
                reason
            );

        }
        catch(error){

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to cancel ticket."
            );

        }

    }
);

export const approveTicketThunk=createAsyncThunk(
    "tickets/approveTicket",
    async({ticketId,reviewNotes},thunkAPI)=>{
        try{
            return await approveTicket(
                ticketId,
                reviewNotes
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to approve ticket"
            );
        }
    }
);

export const rejectTicketThunk=createAsyncThunk(
    "tickets/rejectTicket",
    async({ticketId,reviewNotes}, thunkAPI)=>{
        try{
            return await rejectTicket(
                ticketId,
                reviewNotes
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to reject ticket"
            );
        }
    }
);
const initialState={
    tickets:[],
    selectedTicket:null,
    loading:false,
    error:null
};
const ticketSlice=createSlice({
    name:"tickets",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchMyTickets.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchMyTickets.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.tickets=action.payload.tickets;
            }
        );
        builder.addCase(
            fetchMyTickets.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchTicketById.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.selectedTicket=action.payload;
            }
        );
        builder.addCase(
            fetchTicketById.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchTicketById.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            createNewTicket.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            createNewTicket.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );
        builder.addCase(
            createNewTicket.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            fetchAssignedTickets.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchAssignedTickets.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.tickets=action.payload.tickets;
            }
        );
        builder.addCase(
            fetchAssignedTickets.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            updateStatus.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            saveResolutionNotes.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            fetchAllTickets.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            fetchAllTickets.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.tickets=action.payload.tickets;
            }
        );
        builder.addCase(
            fetchAllTickets.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            assignTicketToStaff.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            assignTicketToStaff.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            assignTicketToStaff.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            editTicketThunk.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            cancelTicketThunk.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            approveTicketThunk.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            rejectTicketThunk.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            reassignTicketThunk.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );
        builder.addCase(
            reassignTicketThunk.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.selectedTicket=action.payload.ticket;
            }
        );
        builder.addCase(
            reassignTicketThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            adminCancelTicketThunk.fulfilled,
            (state,action)=>{
                state.selectedTicket=action.payload.ticket;
            }
        );

    }
})
export default ticketSlice.reducer;