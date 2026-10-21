import StaffLayout from "../components/layout/StaffLayout.jsx";
import {useParams} from "react-router-dom";
//import {staffAssignedTickets } from "../data/staffAssignedTickets.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import Button from "../../components/common/Button.jsx";
import {useState,useEffect} from "react";
import { STAFF_STATUS_OPTIONS } from "../../constants/ticketStatus.js";
import TicketTimeline from "../../components/common/TicketTimeline.jsx";
//import { ticketTimeline } from "../../student/data/ticketTimeline.js";
import TicketComments from "../../components/common/tickets/TicketComments.jsx";
import TicketAttachments from "../../components/common/tickets/TicketAttachments.jsx";
import { useNavigate } from "react-router-dom";
import{
    useDispatch,
    useSelector
} from "react-redux";
import{
    updateStatus,
    reassignTicketThunk
} from "../../features/tickets/ticketSlice.js";
import {
    fetchStaffUsers
} from "../../features/users/userSlice.js";
import { fetchTicketById,saveResolutionNotes } from "../../features/tickets/ticketSlice.js";
//import Ticket from "../../../backend/src/models/Ticket.js";

import {
    joinTicket,
    leaveTicket,
    onSocketReady
} from "../../socket/SocketClient.js";

function StaffTicketDetails(){
    const {ticketId}=useParams();
    const dispatch=useDispatch();
    const{
        selectedTicket,
        loading,
        error
    }=useSelector(state=>state.tickets);
    useEffect(()=>{
        dispatch(fetchTicketById(ticketId));
        dispatch(fetchStaffUsers());
    },[
        dispatch,
        ticketId
    ]);
    const{
        staffUsers
    }=useSelector(state=>state.users);
    const ticket=selectedTicket;
    const[selectedStatus,setSelectedStatus]=useState("");
    useEffect(()=>{
        if(ticket)
        {
            setSelectedStatus(ticket.status);
        }
    },[
        ticket
    ]);

    useEffect(()=>{
        if(!ticketId)
        {
            return;
        }

        onSocketReady(socket=>{
            joinTicket(ticketId);
        });

        return ()=>{
            leaveTicket(ticketId);
        };
    },[
        ticketId
    ]);
    
    //const[comment,setComment]=useState("");
    const[resolutionNote,setResolutionNote]=useState("");
    const[resolutionMessage,setResolutionMessage]=useState("");
    const[resolutionError,setResolutionError]=useState("");

    const [reassignStaff,setReassignStaff]=useState("");
    const [reassignReason,setReassignReason]=useState("");
    const [reassignMessage,setReassignMessage]=useState("");
    const [reassignError,setReassignError]=useState("");

    const statusOptions=STAFF_STATUS_OPTIONS;
    const isClosed=ticket?.status==="Closed";

    const navigate=useNavigate();

    useEffect(()=>{
        if(ticket?.resolutionNotes)
        {
            setResolutionNote(ticket.resolutionNotes);
        }
    },[
        ticket
    ]);
    const handleResolutionSave=async()=>{
        setResolutionMessage("");
        setResolutionError("");
        const result=await dispatch(saveResolutionNotes({
            ticketId,
            resolutionNotes:resolutionNote
        }));
        if(result.type==="tickets/saveResolutionNotes/fulfilled")
        {
            setResolutionMessage("Resolution notes saved successfully")
        }
        if(result.type==="tickets/saveResolutionNotes/rejected")
        {
            setResolutionError(result.payload);
        }
    };
    // const[comments,setComments]=useState([
    //     {
    //         id:1,
    //         author:"John Doe",
    //         role:"Student",
    //         text:"The hostel WiFi has not been working since yesterday."        
    //     }]);
    const[statusMessage,setStatusMessage]=useState("");
    const handleStatusUpdate=async()=>{
        if(
            selectedStatus==="Resolved" && !resolutionNote.trim()
        )
        {
            setStatusMessage("");
            setResolutionError(
                "Please save resolution notes before resolving the ticket."
            );
            return;
        }
        const result=await dispatch(updateStatus({ticketId,status:selectedStatus}));
        if(result.type==="tickets/updateStatus/fulfilled")
        {
            setStatusMessage("Status updated successfully");
        }
    };

    const availableStaff=ticket
    ?staffUsers.filter(staff=>
        staff.department===ticket.department &&
        staff._id!==ticket.assignedTo?._id
    ):[];

    const handleReassign=async()=>
    {
        setReassignError("");
        setReassignMessage("");

        if(!reassignStaff){
            setReassignError("Please select a staff member.");
            return;
        }

        if(!reassignReason.trim()){
            setReassignError("Reason is required.");
            return;
        }

        const result=await dispatch(
            reassignTicketThunk({
                ticketId,
                staffId:reassignStaff,
                reason:reassignReason
            })
        );

        if(result.type==="tickets/reassignTicket/fulfilled"){
            setReassignMessage("Ticket reassigned successfully.");
            setReassignReason("");
            setReassignStaff("");

            setTimeout(()=>{
                navigate("/staff/tickets");
            },1200);
        }

        if(result.type==="tickets/reassignTicket/rejected"){
            setReassignError(result.payload);
        }
    };
    if(loading)
    {
        return(
            <StaffLayout>
                Loading Ticket...
            </StaffLayout>
        );
    }
    if(error)
    {
        return(
            <StaffLayout>
                {error}
            </StaffLayout>
        );
    }
    if(!ticket)
    {
        return(
            <StaffLayout>
                <h1 className="text-3xl font-bold">
                    Ticket Not Found
                </h1>
            </StaffLayout>
        );
    }
    

    return(
        <StaffLayout >
        <h1 className="text-3xl font-bold">
            Ticket Details
        </h1>
        <p className="text-gray-500 mt-2">
            Tickets &gt; Ticket Details
        </p>
        {ticket?.status==="Canceled" && (
            <div className="mt-6 bg-red-100 border border-red-300 text-red-700 rounded-xl p-4">
                <h3 className="font-semibold">
                    Ticket Cancelled
                </h3>
                <p className="text-sm mt-1">
                    This ticket was cancelled by the student. No further action can be taken.
                </p>
            </div>
        )}
        {ticket?.status==="Closed" && (
            <div className="mt-6 bg-green-100 border border-green-300 text-green-700 rounded-xl p-4">
                <h3 className="font-semibold">
                    Ticket Closed
                </h3>

                <p className="text-sm mt-1">
                    This ticket has been reviewed and closed by the administrator.
                    It is now read-only.
                </p>
            </div>
        )}
        <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-semibold">
                        {ticket.title}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-500 mt-3">
                        <span>{ticket.createdBy?.name}</span>
                        <span>{ticket.department}</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <StatusBadge status={ticket.status}/>
                        <PriorityBadge priority={ticket.priority}/>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Description
                    </h2>
                    <p className="text-gray-700">
                        {ticket.description}
                    </p>
                </div>
                <TicketAttachments
                ticketId={ticketId}
                canUpload={ticket.status!=="Closed" && ticket.status!=="Canceled"}
                />
            </div>


            <div className="col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Ticket Information
                    </h3>
                    <div className="space-y-3">
                        <p>
                            <strong>ID: </strong> {ticket._id}
                        </p>
                        <p>
                            <strong>Assigned To: </strong> {ticket.assignedTo?.name || "Unassigned"}
                        </p>
                        <p>
                            <strong>Created: </strong> {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                </div>
                {ticket.status!=="Closed" && ticket.status!=="Canceled" && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Reassign Ticket
                    </h2>
                    <select
                    value={reassignStaff}
                    onChange={(e)=>setReassignStaff(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    >
                        <option value="">
                            Select Staff
                        </option>
                        {availableStaff.map(staff=>(
                            <option
                            key={staff._id}
                            value={staff._id}
                            >
                                {staff.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                    rows="3"
                    className="w-full border rounded-lg p-3 mt-3"
                    placeholder="Reason for reassignment..."
                    value={reassignReason}
                    onChange={(e)=>setReassignReason(e.target.value)}
                    />
                    <Button 
                    text="Reassign Ticket"
                    type="button"
                    onClick={handleReassign}
                    className="mt-3"
                    />

                    {reassignError &&
                    <p className="text-red-500 text-sm mt-2">
                        {reassignError}
                    </p>
                    }
                    {reassignMessage &&
                    <p className="text-green-600 text-sm mt-2">
                        {reassignMessage}
                    </p>
                    }
                </div>
                )}
                {ticket.status!=="Canceled" && ticket.status!=="Closed" && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Update Status
                    </h2>
                    <select value={selectedStatus} onChange={(e)=>{setSelectedStatus(e.target.value); setStatusMessage("");}} className="w-full border rounded-lg p-3">
                        {statusOptions.map(status=>(
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                        ))}
                    </select>
                    <Button text="Update Status" type="button" onClick={handleStatusUpdate} className="mt-2"/>
                    {statusMessage && (
                        <p className="text-green-600 text-sm mt-3">
                            {statusMessage}
                        </p>
                    )}
                </div>
                )}
                {ticket.status!=="Closed" && ticket.status!=="Canceled" && (
                <div className="bg-white rounded-xl shadow p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Resolution Notes
                    </h2>
                    <textarea
                    value={resolutionNote}
                    onChange={(e)=>setResolutionNote(e.target.value)}
                    rows="4"
                    placeholder="Describe how the issue was resolved..."
                    className="w-full border rounded-lg p-3"
                    />
                    <Button text="Save Resolution Notes" type="button" onClick={handleResolutionSave}/>
                    {resolutionError && (
                        <p className="text-red-500 text-sm mt-3">
                            {resolutionError}
                        </p>
                    )}
                    {resolutionMessage &&(
                        <p className="text-green-600 text-sm mt-3">
                            {resolutionMessage}
                        </p>
                    )}
                </div>
                )}

                {ticket.status=="Canceled" && (
                    <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">🔒</span>
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {isClosed?"Ticket Closed":"Ticket Canceled"}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {isClosed?
                                        "This ticket has been reviewed and approved by the administrator."
                                        :"This ticket has been canceled."}
                                    </p>
                                </div>
                            </div>
                            <div className="border rounded-lg bg-green-50 border-green-200 p-4">
                                <p className="font-medium text-green-700">
                                    No further actions are allowed.
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {isClosed?"Closed tickets ":"Canceled tickets "} 
                                    are immutable. If the student reports the issue again, a new ticket should be created.
                                    
                                </p>
                            </div>
                        </div>
                )}
              
                
                

            </div>
        </div>
        <div className="mt-6">
            <TicketComments ticketId={ticketId} canCreateInternalNotes={true}
            canComment={
                ticket.status!=="Closed" &&
                ticket.status!=="Canceled"
            }/>
            <TicketTimeline ticketId={ticket._id}/>
        </div>
        </StaffLayout>

    );
}
export default StaffTicketDetails;