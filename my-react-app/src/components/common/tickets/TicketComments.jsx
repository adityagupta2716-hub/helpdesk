import { useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { fetchComments,addCommentThunk, receiveComment, removeComment } from "../../../features/comments/commentSlice";
import Button from "../Button";
import { useRef } from "react";
import {
    deleteCommentThunk
} from "../../../features/comments/commentSlice.js";
import ConfirmModal from "../modals/ConfirmModal.jsx";

import {
    onSocketReady
} from "../../../socket/SocketClient.js";

function TicketComments({ticketId,canCreateInternalNotes=false,canComment=true})
{
    const dispatch=useDispatch();
    const {
        comments,
        loading
    }=useSelector(
        state=>state.comments
    );
    const{user}=useSelector(state=>state.auth);

    const commentsEndRef=useRef(null);

    const commentsContainerRef=useRef(null);

    // useEffect(()=>{
    //     commentsEndRef.current?.scrollIntoView({
    //         behavior:"smooth"
    //     });
    // },[comments]);
    useEffect(()=>{
        commentsContainerRef.current?.scrollTo({
            top:commentsContainerRef.current.scrollHeight,
            behavior:"smooth"
        });
    },[
        comments.length
    ]);

    const [comment,setComment]=useState("");
    const [isInternal,setIsInternal]=useState(false);
    const[showDeleteModal,setShowDeleteModal]=useState(false);
    const[commentToDelete,setCommentToDelete]=useState(null);

    useEffect(()=>{
        dispatch(
            fetchComments(ticketId)
        );
    },[
        dispatch,
        ticketId
    ]);

    useEffect(()=>{
        let socketInstance=null;
        onSocketReady(socket=>{
            socketInstance=socket;
            const handleCommentCreated=(comment)=>{
                if(comment.ticket!==ticketId)
                {
                    return;
                }
                dispatch(receiveComment(comment));
            };

            const handleCommentDeleted=({ticketId:updatedTicketId,commentId})=>{
                if(updatedTicketId!==ticketId)
                {
                    return;
                }
                dispatch(removeComment(commentId));
            };

            socket.on("commentCreated",handleCommentCreated);

            socket.on("commentDeleted",handleCommentDeleted);
        });

        return ()=>{
            if(socketInstance)
            {
                socketInstance.off("commentCreated");
                socketInstance.off("commentDeleted");
            }
        };
    },[
        dispatch,
        ticketId
    ]);

    const handleAddComment=async()=>{
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

        // requestAnimationFrame(()=>{
        //     commentsEndRef.current?.scrollIntoView({
        //         behavior:"smooth"
        //     });
        // });
    }
    };
    const getRoleBadgeColor=(role)=>{
        switch(role)
        {
            case "admin":
                return "bg-red-100 text-red-700";
            
            case "staff":
                return "bg-blue-100 text-blue-700";
            
            case "student":
                return "bg-gray-100 text-gray-700";
        }
    };
    const canDeleteComment=(comment)=>{
        const isOwner=comment.user?._id===user?.id;
        const isAdmin=user?.role==="admin";
        return isOwner || isAdmin;
    };
    const openDeleteModal=(commentId)=>{
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
    };
    const closeDeleteModal=()=>{
        setShowDeleteModal(false);
        setCommentToDelete(null);
    };
    const confirmDelete=async()=>{
        await dispatch(deleteCommentThunk(commentToDelete));
        closeDeleteModal();
    };
    if(loading)
    {
        return(
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                Loading comments...
            </div>
        );
    }

    return(
        <div className="bg-white rounded-xl shadow p-6 mt-6 h-[650px]">
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                    <div ref={commentsContainerRef} className="flex-1 overflow-y-auto pr-2 min-h-0">
                        {comments.length===0 && (
                        <p className="text-gray-500">
                            No comments yet.
                            Start the conversation regarding this ticket.
                        </p>
                        )}
                        {comments.map(item=>(
                            <div key={item._id} className="border rounded-xl p-4 mb-3 bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {item.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {item.user?.name}
                                            </p>
                                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium
                                            ${getRoleBadgeColor(item.user?.role)}`}>
                                                {item.user?.role?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day:"numeric",
                                                        month:"short",
                                                        hour:"numeric",
                                                        minute:"2-digit"
                                                    }
                                                )}
                                        </span>
                                        {canComment && canDeleteComment(item) && (
                                        <button
                                        onClick={()=>openDeleteModal(item._id)}
                                        className="text-red-600 text-sm mt-2 hover:underline">
                                            Delete
                                        </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 mt-2">
                                    {item.message}
                                </p>
                                
                                {item.isInternal && (
                                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                                        Internal Note
                                    </span>
                                )}
                            </div>
                        ))}
                        <div ref={commentsEndRef}></div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                    <textarea value={comment} onChange={(e)=>setComment(e.target.value)} rows="2" disabled={!canComment} 
                    placeholder={
                        canComment
                        ?"Add a comment..."
                        :"Comments are disabled for this ticket."
                    }  
                    className="w-full border rounded-lg p-3"
                    onKeyDown={(e)=>{
                        if(e.key==="Enter" && !e.shiftKey)
                        {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}/>
                    {canComment && canCreateInternalNotes && (
                        <label className="flex items-center gap-2 mt-3">
                        <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e)=>setIsInternal(e.target.checked)}
                        />
                        Internal Note
                    </label>
                    )}
                    {canComment && (
                    <Button text="Send" type="button" onClick={handleAddComment} />
                    )}
                    </div>
              </div>
              <ConfirmModal
              isOpen={showDeleteModal}
              title="Delete Comment"
              message="Are you sure you want to delete this comment?"
              onConfirm={confirmDelete}
              onCancel={closeDeleteModal}
              />
        </div>

    );
}

export default TicketComments;