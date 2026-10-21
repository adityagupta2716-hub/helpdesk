import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import {useParams} from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import TicketTimeline from "../../components/common/TicketTimeline.jsx";
//import { ticketTimeline } from "../data/ticketTimeline.js";
import { useEffect } from "react";
import TicketComments from "../../components/common/tickets/TicketComments.jsx";
import TicketAttachments from "../../components/common/tickets/TicketAttachments.jsx";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
import{
    useDispatch,
    useSelector
} from "react-redux";
import { fetchTicketById } from "../../features/tickets/ticketSlice.js";
import {useState} from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/common/forms/FormInput.jsx";
import FormTextarea from "../../components/common/forms/FormTextarea.jsx";
import FormSelect from "../../components/common/forms/FormSelect.jsx";
import useDepartmentOptions from "../../hooks/useDepartmentOptions.js";
import { PRIORITY_OPTIONS } from "../../constants/priorities.js";
import { CATEGORY_OPTIONS } from "../../constants/category.js";
import {
    editTicketThunk,
    cancelTicketThunk
} from "../../features/tickets/ticketSlice.js";
import ConfirmModal from "../../components/common/modals/ConfirmModal.jsx";

import {
    joinTicket,
    leaveTicket,
    onSocketReady
} from "../../socket/SocketClient.js";

function TicketDetails(){
    const [isEditing,setIsEditing]=useState(false);

    const [showCancelModal,setShowCancelModal]=useState(false);
    const [cancelReason,setCancelReason]=useState("");
    const [cancelError,setCancelError]=useState("");

    const{
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm();
    const toastShown=useRef(false);
    const {ticketId}=useParams();
    const dispatch=useDispatch();
    const location=useLocation();
    const {
        selectedTicket,
        loading,
        error
    }=useSelector(state=>state.tickets);

    useEffect(()=>{
        if(!ticketId)
        {
            return
        }
        dispatch(fetchTicketById(ticketId));
    },
    [
        dispatch,
        ticketId
    ]);

    useEffect(()=>{
        if(location.state?.showAttachmentToast && !toastShown.current)
        {
            toastShown.current=true;
            toast.success("Ticket created successfully! You can upload attachments.");
        }
    },[location.state]);

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

    useEffect(()=>{
        let socketInstance=null;
        onSocketReady(socket=>{
            socketInstance=socket;
            const handleTicketUpdated=({
                ticketId:updatedTicketId
            })=>{
                if(updatedTicketId!==ticketId)
                {
                    return;
                }

                dispatch(fetchTicketById(ticketId));
            };

            socket.on("ticketUpdated",handleTicketUpdated);
        });

        return ()=>{
            if(socketInstance)
            {
                socketInstance.off("ticketUpdated");
            }
        };
    },[
        dispatch,
        ticketId
    ]);

    const ticket=selectedTicket;
    useEffect(()=>{
        if(ticket)
        {
            reset({
                title:ticket.title,
                description:ticket.description,
                department:ticket.department,
                category:ticket.category,
                priority:ticket.priority
            });
        }
    },[
        ticket,
        reset
    ]);
    const DEPARTMENT_OPTIONS=useDepartmentOptions();
    const handleEditTicket=async(data)=>{
        const result=await dispatch(
            editTicketThunk({
                ticketId,
                ticketData:data
            })
        );
        console.log(result);
        if(result.type.endsWith("/fulfilled"))
        {
            toast.success("Ticket updated successfully");
            setIsEditing(false);
            dispatch(fetchTicketById(ticketId));
        }
    };
    const handleCancelTicket=async()=>{
        if(!cancelReason.trim())
        {
            setCancelError(
                "Please provide a reason fro cancelling this ticket."
            );
            return;
        }

        const result=await dispatch(cancelTicketThunk({
            ticketId,
            reason:cancelReason
        }));
        if(result.type.endsWith("/fulfilled"))
        {
            toast.success("Ticket cancelled successfully");
            setShowCancelModal(false);
            setCancelReason("");
            setCancelError("");
            dispatch(fetchTicketById(ticketId));
        }
    };
    if(loading)
    {
        return(
            <DashboardLayout>
                <h1>
                    Loading...
                </h1>
            </DashboardLayout>
        );
    }
    if(error)
    {
        return(
            <DashboardLayout>
                <h1>
                    {error}
                </h1>
            </DashboardLayout>
        );
    }
    if (!ticket){
        return(
            <DashboardLayout>
                <h1>Ticket Not Found</h1>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <h1 className="text-3xl font bold">
                Ticket Details
            </h1>
            <p className="text-gray-500 mt-2">
                My Tickets &gt; Ticket Details
            </p>
            {ticket.status==="Canceled" && (
                <div className="mt-6 bg-red-50 border border-red-300 rounded-xl p-4">
                    <h3 className="text-red-700 font-semibold">
                        Ticket Cancelled
                    </h3>
                    <p className="text-red-600 text-sm mt-1">
                        This ticket has been cancelled. No further updates can be made.
                        If you still need assistance, please create a new ticket.
                    </p>
                </div>
            )}
            {ticket.status === "Closed" && (
                <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-5">
                    <h3 className="font-semibold text-green-700">
                        Ticket Closed
                    </h3>

                    <p className="mt-2 text-sm text-green-700">
                        This ticket has been reviewed and closed by the administrator.
                        No further changes can be made.
                    </p>

                    {ticket.adminReview?.reviewNotes && (
                        <div className="mt-4 rounded-lg bg-white p-3 border">
                            <p className="font-medium">
                                Admin Review
                            </p>

                            <p className="mt-1 text-gray-700">
                                {ticket.adminReview.reviewNotes}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-2xl font-semibold">
                            {ticket.title}
                            <p className="text-sm text-gray-500 mt-2">
                             {ticket.department} • {ticket.priority} Priority • {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 mt-6">
                        {
                        !isEditing?(
                            <>
                                <h2 className="text-xl font-semibold mb-4">
                                    Description
                                </h2>
                                <p className="text-gray-700">
                                    {ticket.description}
                                </p>
                            </>
                        ):(
                            <form onSubmit={handleSubmit(handleEditTicket)}>
                                <h2 className="text-xl font-semibold mb-4">
                                    Edit Ticket
                                </h2>
                                <FormInput
                                label="Title"
                                name="title"
                                type="text"
                                register={register}
                                rules={{
                                    required:"Title is required"
                                }}
                                error={errors.title}
                                />
                                <FormTextarea
                                label="Description"
                                name="description"
                                register={register}
                                rules={{
                                    required:"Description is required"
                                }}
                                error={errors.description}
                                />
                                <FormSelect
                                label="Department"
                                name="department"
                                register={register}
                                rules={{
                                    required:"Department is required"
                                }}
                                error={errors.department}
                                options={DEPARTMENT_OPTIONS}
                                />
                                <FormSelect
                                label="Category"
                                name="category"
                                register={register}
                                rules={{
                                    required:"Category is required"
                                }}
                                error={errors.category}
                                options={CATEGORY_OPTIONS}
                                />
                                <FormSelect
                                label="Priority"
                                name="priority"
                                register={register}
                                rules={{
                                    required:"Priority is required"
                                }}
                                error={errors.priority}
                                options={PRIORITY_OPTIONS}
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                        Save
                                    </button>
                                    <button
                                    type="button"
                                    onClick={()=>{
                                        setIsEditing(false);
                                        reset({
                                            title:ticket.title,
                                            description:ticket.description,
                                            department:ticket.department,
                                            category:ticket.category,
                                            priority:ticket.priority
                                        });
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    {!isEditing && (
                        <>
                        <TicketAttachments
                        ticketId={ticketId}
                        canUpload={true && ticket.status!=="Canceled" && ticket.status!=="Closed"}/>
                        <TicketComments ticketId={ticketId}
                        canComment={
                            ticket.status!=="Closed" &&
                            ticket.status!=="Canceled"
                        }/>
                        </>
                    )}
                </div>
                <div className="col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-lg mb-4">
                            Ticket Information
                        </h3>
                        <div className="space-y-3">
                        <p>
                            <strong>ID: </strong>{ticket._id}
                        </p>
                        <p>
                            <strong>Category: </strong>{ticket.category}
                        </p>
                        <div>
                            <p className="font-semibold mb-1">
                                Status
                            </p>
                            <StatusBadge status={ticket.status}/>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">
                                Priority
                            </p>
                            <PriorityBadge priority={ticket.priority}/>
                        </div>
                        <p>
                            <strong>Assigned To: </strong>{ticket.assignedTo?.name || "Unassigned"}
                        </p>
                        <p>
                            <strong>Created: </strong>{new Date(
                                ticket.createdAt).toLocaleDateString()}
                        </p>
                        {
                            ticket.status==="Open" && !isEditing && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                    onClick={()=>setIsEditing(true)}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                    onClick={()=>{
                                        setShowCancelModal(true);
                                        setCancelReason("");
                                        setCancelError("");
                                    }}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )
                        }
                        </div>
                    </div>
                    <TicketTimeline ticketId={ticketId}/>
                </div>
            </div>
            
            
            <ConfirmModal
            isOpen={showCancelModal}
            title="Cancel Ticket"
            message="Please provide a reason for cancelling this ticket. This helps the support team understand why the request is being withdrawn."
            showTextarea={true}
            textareaValue={cancelReason}
            onTextareaChange={(value)=>{
                setCancelReason(value);
                if(value.trim())
                {
                    setCancelError("");
                }
            }}
            textareaPlaceholder="Enter cancellation reason..."
            error={cancelError}
            confirmText="Cancel Ticket"
            cancelText="Keep Ticket"
            onCancel={()=>{
                setShowCancelModal(false);
                setCancelReason("");
                setCancelError("");
            }}
            onConfirm={handleCancelTicket}
            />
        </DashboardLayout>
    );
}
export default TicketDetails;