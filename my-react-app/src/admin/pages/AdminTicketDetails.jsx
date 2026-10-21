import AdminLayout from "../components/layout/AdminLayout.jsx";
import {useParams} from "react-router-dom";
//import {adminTickets } from "../data/adminTickets.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import Button from "../../components/common/Button.jsx";
import {useState, useEffect} from "react";
//import { staffMembers } from "../data/staffMembers.js";
import { getAdminStatusOptions } from "../../constants/ticketStatus.js";
//import { ticketTimeline } from "../../student/data/ticketTimeline.js";
import TicketTimeline from "../../components/common/TicketTimeline.jsx";
import TicketComments from "../../components/common/tickets/TicketComments.jsx";
import TicketAttahcments from "../../components/common/tickets/TicketAttachments.jsx";
import ConfirmModal from "../../components/common/modals/ConfirmModal.jsx";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    assignTicketToStaff,
    fetchTicketById,
    updateStatus,
    approveTicketThunk,
    rejectTicketThunk,
    adminCancelTicketThunk
} from "../../features/tickets/ticketSlice.js";
import {
    fetchStaffUsers
} from "../../features/users/userSlice.js";
import {
    fetchComments,
    addCommentThunk
} from "../../features/comments/commentSlice.js";

import {
    joinTicket,
    leaveTicket,
    onSocketReady
} from "../../socket/SocketClient.js";

function AdminTicketDetails(){
    const {ticketId}=useParams();
    const dispatch=useDispatch();
    const {
        selectedTicket,
        loading,
        error
    }=useSelector(state=>state.tickets);
    const{
        staffUsers
    }=useSelector(state=>state.users);
    const {
        comments
    }=useSelector(state=>state.comments);
    useEffect(()=>{
        dispatch(
            fetchTicketById(ticketId)
        );
        dispatch(
            fetchStaffUsers()
        );
        dispatch(
            fetchComments(ticketId)
        );
    },[
        dispatch,
        ticketId
    ]);
    const ticket=selectedTicket;
    const isClosed=ticket?.status==="Closed";
    const isCanceled=ticket?.status==="Canceled";
    const[status,setStatus]=useState(ticket?.status||"Open");
    const[assignedTo,setAssignedTo]=useState("");
    const[reassignReason,setReassignReason]=useState("");
    const[successMessage,setSuccessMessage]=useState("");
    const[statusMessage,setStatusMessage]=useState("");
    const[reviewNotes,setReviewNotes]=useState("");
    const[reviewMessage,setReviewMessage]=useState("");
    const[reviewError,setReviewError]=useState("");
    const[assignError,setAssignError]=useState("");
    const[comment,setComment]=useState("");
    const[isInternal,setIsInternal]=useState(false);

    const[cancelReason,setCancelReason]=useState("");
    const[cancelMessage,setCancelMessage]=useState("");
    const[cancelError,setCancelError]=useState("");
    const[showCancelModal,setShowCancelModal]=useState(false);

    useEffect(()=>{
        if(ticket?.assignedTo)
        {
            setAssignedTo(ticket.assignedTo._id);
        }
    },[
        ticket
    ]);
    useEffect(()=>{
        if(ticket)
        {
            setStatus(ticket.status);
        }
    },[ticket]);
    useEffect(()=>{
        if(ticket?.adminReview?.reviewNotes)
        {
            setReviewNotes(ticket.adminReview.reviewNotes);
        }
    },[ticket]);

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

    const filteredStaffUsers=ticket
    ?staffUsers.filter(
        staff=>staff.department===ticket.department
    )
    :[];
    const handleStatusUpdate=async()=>{
        if(!status)
        {
            setStatusMessage("");
            setStatusError("Please select a status.");
            return;
        }
        const result=await dispatch(updateStatus({ticketId,status}));
        if(result.type==="tickets/updateStatus/fulfilled")
        {
            setStatusMessage("Status updated successfully");
        }
    };

    const handleCancelTicket = async () => {

        if(!cancelReason.trim()){
            setCancelError("Cancellation reason is required.");
            return;
        }

        const result = await dispatch(
            adminCancelTicketThunk({
                ticketId,
                reason: cancelReason
            })
        );

        if(result.type==="tickets/adminCancelTicket/fulfilled"){

            setShowCancelModal(false);
            setCancelReason("");

            dispatch(fetchTicketById(ticketId));
        }
    };

    const handleApprove=async()=>{
        setReviewError("");
        setReviewMessage("");

        const result=await dispatch(
            approveTicketThunk({
                ticketId,
                reviewNotes
            })
        );

        if(result.type==="tickets/approveTicket/fulfilled")
        {
            setReviewMessage("Ticket approved and closed.");
        }

        if(result.type==="tickets/approveTicket/rejected")
        {
            setReviewError(result.payload);
        }
    };

    const handleReject=async()=>{
        setReviewError("");
        setReviewMessage("");

        if(!reviewNotes.trim())
        {
            setReviewError("Review notes are required.");
            return;
        }

        const result=await dispatch(
            rejectTicketThunk({
                ticketId,
                reviewNotes
            })
        );

        if(result.type==="tickets/rejectTicket/fulfilled")
        {
            setReviewMessage("Ticket returned to staff.");
        }

        if(result.type==="tickets/rejectTicket/rejected")
        {
            setReviewError(result.payload);
        }
    };
    
    
    const statusOptions=getAdminStatusOptions(ticket);

const addComment=async()=>{
    if(!comment.trim())
    {
        return;
    }
    const result=await dispatch(addCommentThunk({
        ticketId,
        commentData:{
            message:comment,
            isInternal
        }
    }));
    if(result.type==="comments/addComment/fulfilled")
    {
        setComment("");
        setIsInternal(false);
    }
};
const handleAssign=async()=>{
    setAssignError("");
    setSuccessMessage("");
    if(!assignedTo)
    {
        setAssignError("Please select a staff member");
        return;
    }
    if(ticket.assignedTo?._id===assignedTo)
    {
        setAssignError("Please select a different staff member");
        return;
    }
    const result=await dispatch(assignTicketToStaff({
        ticketId,
        staffId:assignedTo,
        reason:reassignReason
    }));
    if(result.type==="tickets/assignTicket/fulfilled")
    {
        setSuccessMessage(
            ticket.assignedTo
            ?"Ticket reassigned successfully"
            :"Ticket assigned successfully."
        );

        setReassignReason("");
        dispatch(fetchTicketById(ticketId));
    }
    if(result.type==="tickets/assignTicket/rejected")
    {
        setAssignError(result.payload);
    }
};
    if(loading)
    {
        return(
            <AdminLayout>
                Loading Ticket...
            </AdminLayout>
        );
    }
    if(error && !selectedTicket)
    {
        return(
            <AdminLayout>
                {error}
            </AdminLayout>
        );
    }
    if(!ticket)
    {
        return(
            <AdminLayout>
                <h1 className="text-3xl font-bold">
                    Ticket Not Found
                </h1>
            </AdminLayout>
        );
    }
    return(
        <AdminLayout >
        <h1 className="text-3xl font-bold">
            Ticket Details
        </h1>
        <p className="text-gray-500 mt-2">
            Tickets &gt; Ticket Details
        </p>
        {ticket.status==="Canceled" && (
            <div className="mt-6 bg-red-50 border border-red-300 rounded-xl p-4">
                <h3 className="text-red-700 font-semibold">
                    Ticket Cancelled
                </h3>

                <p className="text-red-600 text-sm mt-1">
                    This ticket has been cancelled.
                    This ticket can no longer be assigned or processed.
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
                        <span>
                            {ticket.createdBy?.name}
                        </span>
                        <span>
                            {ticket.createdBy?.email}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-4">
                        {ticket.department}
                    </p>
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
                <TicketAttahcments ticketId={ticketId} canUpload={false}/>
                <TicketComments ticketId={ticketId} canCreateInternalNotes={true} 
                canComment={
                    ticket.status!=="Closed" &&
                    ticket.status!=="Canceled"
                }
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
                            <strong>Assigned To: </strong> {ticket.assignedTo?.name}
                        </p>
                        <p>
                            <strong>Department: </strong> {ticket.department}
                        </p>
                        <p>
                            <strong>Created: </strong> {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {(!isClosed && !isCanceled )? (
                        <div className="bg-white rounded-xl shadow p-6 space-y-3">
                            {ticket.status!=="Resolved" && (
                            <div>
                            <label className="block text-sm font-medium mb-2">
                                {ticket.assignedTo?"Reassign To":"Assign To"}
                            </label>
                            <select
                            value={assignedTo}
                            onChange={(e)=>
                                {setAssignedTo(e.target.value);setSuccessMessage("")}
                            }
                            className="w-full border rounded-lg p-3">
                                <option value="">
                                    Select Staff
                                </option>
                                {filteredStaffUsers.map(staff=>(
                                    <option key={staff._id} value={staff._id} disabled={ticket.assignedTo?._id===staff._id}>
                                        {staff.name} ({staff.department})
                                        {ticket.assignedTo?._id===staff._id
                                        ?" (Current)"
                                        :""}
                                    </option>
                                ))}
                            </select>
                            {ticket.assignedTo && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Reassignment Reason
                                    </label>

                                    <textarea
                                    rows="3"
                                    value={reassignReason}
                                    onChange={(e)=>setReassignReason(e.target.value)}
                                    placeholder="Optional reason for reassigning..."
                                    className="w-full border rounded-lg p-3"
                                    />
                                </div>
                            )}
                            {
                                assignError && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {assignError}
                                    </p>
                                )
                            }
                            {filteredStaffUsers.length===0 && (
                                <p className="text-red-500 text-sm mt-2 mb-2">
                                    No staff available for this department.
                                </p>
                            )}
                            <Button text={ticket.assignedTo?"Reassign Ticket":"Assign Ticket"} type="button" onClick={handleAssign} className="mt-2"/>
                            {
                                successMessage && (
                                    <p className="text-green-600 mt-3 text-sm">
                                        {successMessage}
                                    </p>
                                )
                            }
                            </div>
                            )}
                            {ticket.status!=="Canceled" &&(
                            <Button
                            text="Cancel Ticket"
                            type="button"
                            onClick={()=>setShowCancelModal(true)}
                            className="mt-4 bg-red-600 hover:bg-red-700"
                            />
                            )}
                            <div>
                            {/* {ticket.status!=="Resolved" && (
                                <>
                                    <label className="block text-sm font-medium mb-2">
                                        Status
                                    </label>
                                    <select value={status} onChange={(e)=>{setStatus(e.target.value);setStatusMessage("")}} className="w-full border rounded-lg p-3">
                                        <option value="">Select Status</option>
                                        {statusOptions.map(status=>(
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                              
                             
                                <Button text="Update Status" type="button" onClick={handleStatusUpdate}/>
                                {statusMessage && (
                                    <p className="text-green-600 text-sm mt-2">
                                        {statusMessage}
                                    </p>
                                )}
                                </>
                            )} */}
                            </div>
                            <div>
                                {ticket.status==="Resolved" &&(
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
                                        <h3 className="text-lg font-semibold">
                                            Admin Review
                                        </h3>

                                        <p className="text-sm text-gray-600 mt-1">
                                            Staff has marked this ticket as resolved.
                                            Review the resolution before closing the ticket.
                                        </p>

                                        <div className="mt-5">
                                            <label className="block font-medium mb-2">
                                                Staff Resolution Notes
                                            </label>

                                            <textarea 
                                            value={ticket.resolutionNotes || "No resolution notes provided"}
                                            readOnly
                                            rows={5}
                                            className="w-full border rounded-lg p-3 bg-gray-100"
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <label className="block font-medium mb-2">
                                                Review Notes
                                            </label>

                                            <textarea
                                            value={reviewNotes}
                                            onChange={(e)=>setReviewNotes(e.target.value)}
                                            rows={4}
                                            placeholder="Option for approval. Required when rejected."
                                            className="w-full border rounded-lg p-3"
                                            />
                                        </div>
                                        <div className="flex gap-3 mt-5">
                                            <Button 
                                            text="Approve & Close"
                                            type="button"
                                            onClick={handleApprove}
                                            />
                                            <Button 
                                            text="Reject & Return"
                                            type="button"
                                            onClick={handleReject}
                                            />
                                        </div>

                                        {reviewError && (
                                            <p className="text-red-600 mt-3">
                                                {reviewError}
                                            </p>
                                        )}
                                        {reviewMessage && (
                                            <p className="text-green-600 mt-3">
                                                {reviewMessage}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                    </div>
                    ):(
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
                    <TicketTimeline ticketId={ticket._id} />
                    

                </div>
                <ConfirmModal
                    isOpen={showCancelModal}
                    title="Cancel Ticket"
                    message="This action cannot be undone. Please enter the reason for cancelling."

                    showTextarea={true}
                    textareaValue={cancelReason}
                    onTextareaChange={setCancelReason}
                    textareaPlaceholder="Cancellation reason..."
                    error={cancelError}

                    confirmText="Cancel Ticket"
                    cancelText="Back"

                    onCancel={()=>{
                        setShowCancelModal(false);
                        setCancelReason("");
                        setCancelError("");
                    }}

                    onConfirm={handleCancelTicket}
                />

            </div>
        </AdminLayout>

    );
}
export default AdminTicketDetails;