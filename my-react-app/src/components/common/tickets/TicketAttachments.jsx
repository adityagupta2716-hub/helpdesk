import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAttachments,
    uploadAttachmentThunk,
    deleteAttachmentThunk,
    receiveAttachment,
    removeAttachment
} from "../../../features/attachments/attachmentSlice.js";
import Button from "../Button.jsx";
import { useRef } from "react";
import ConfirmModal from "../modals/ConfirmModal.jsx";

import {
    onSocketReady
} from "../../../socket/SocketClient.js";

function TicketAttachments({
    ticketId,
    canUpload=true
})
{
    const dispatch=useDispatch();
    const{
        attachments,
        loading,
        uploadLoading,
        error
    }=useSelector(state=>state.attachments);
    const {user}=useSelector(state=>state.auth);
    console.log(user);
    const[uploadError,setUploadError]=useState("");
    const [selectedFile,setSelectedFile]=useState(null);
    const[showDeleteModal,setShowDeleteModal]=useState(false);
    const[attachmentToDelete,setAttachmentToDelete]=useState(null);
    const fileInputRef=useRef(null);
    useEffect(()=>{
        dispatch(fetchAttachments(ticketId));
    },[
        dispatch,
        ticketId
    ]);

    useEffect(()=>{

        let socketInstance=null;

        onSocketReady(socket=>{

            socketInstance=socket;

            const handleAttachmentUploaded=(attachment)=>{

                dispatch(

                    receiveAttachment(

                        attachment

                    )

                );

            };

            const handleAttachmentDeleted=({

                attachmentId

            })=>{

                dispatch(

                    removeAttachment(

                        attachmentId

                    )

                );

            };

            socket.on(

                "attachmentUploaded",

                handleAttachmentUploaded

            );

            socket.on(

                "attachmentDeleted",

                handleAttachmentDeleted

            );

        });

        return ()=>{

            if(socketInstance)
            {
                socketInstance.off(
                    "attachmentUploaded"
                );

                socketInstance.off(
                    "attachmentDeleted"
                );
            }

        };

    },[
        dispatch,
        ticketId
    ]);

    const handleUpload=async()=>{
        setUploadError("");
        if(!selectedFile)
        {
            setUploadError("Please select a file first.");
            return;
        }
        const result=await dispatch(uploadAttachmentThunk({
            ticketId,
            file:selectedFile
        }));
        if(result.type==="attachments/uploadAttachment/fulfilled")
        {
            setSelectedFile(null);
            if(fileInputRef.current)
            {
                fileInputRef.current.value="";
            }
        }
    };
    const openDeleteModal=(attachmentId)=>{
        setAttachmentToDelete(attachmentId);
        setShowDeleteModal(true);
    };
    const closeDeleteModal=()=>{
        setShowDeleteModal(false);
        setAttachmentToDelete(null);
    };
    const confirmDelete=async()=>{
        await dispatch(deleteAttachmentThunk(attachmentToDelete));
        closeDeleteModal();
    };
    const getFileIcon=(fileType)=>{
        if(fileType?.includes("image"))
        {
            return "🖼️";
        }
        if(fileType?.includes("pdf"))
        {
            return "📄";
        }
        if(fileType?.includes("word")||fileType?.includes("document"))
        {
            return "📝";
        }
        if(fileType?.includes("excel")||fileType?.includes("sheet"))
        {
            return "📊";
        }
        return "📎";
    };
    const canDeleteAttachment=(file)=>{
        console.log("FILE OWNER:",file.uploadedBy?._id);
        console.log("CURRENT USER:",user?.id);
        const isOwner=file.uploadedBy?._id===user?.id;
        const isAdmin=user?.role==="admin";
        return isOwner || isAdmin;
    };
    if(loading)
    {
        return(
            <div className="bg-white rounded-xl shadow p-6">
                Loading Attachments...
            </div>
        );
    }
    return(
        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">
                Attachments
            </h2>
            {attachments.length===0 &&(
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <p className="text-4xl mb-3">
                        📎
                    </p>
                    <p className="font-medium">
                        No Attachments Yet
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload screenshots, documents or proof file
                    </p>
                </div>
            )}
            <div className="space-y-3">
                {attachments.map(file=>(
                    <div key={file._id}
                    className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                                {getFileIcon(file.fileType)}
                            </div>
                            <div>
                                <p className="font-medium">
                                    {file.fileName}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Uploaded by {file.uploadedBy?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(
                                        file.createdAt).toLocaleTimeString()
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition"
                            >
                                View
                            </a>
                            {canDeleteAttachment(file) && (
                                <button onClick={()=>openDeleteModal(file._id)}
                                className="text-red-600 hover:underline">
                                    Delete
                                </button>
                            )}
                        </div>
                     </div>

                ))}
            </div>
            {canUpload &&(
                <div className="border-t pt-5 mt-5">
                    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300
                    rounded-xl p-6 cursor-pointer hover:border-blue-500 transition bg-gray-50">
                        <input
                        id="attachmentInput"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e)=>{setSelectedFile(e.target.files[0]);
                            setUploadError("");
                        }}
                        />
                        <div className="text-center">
                            <p className="font-medium">
                                📤 Upload Attachment
                            </p>
                            <p className="text-sm text-gray-500">
                                Click here to choose a file
                            </p>
                            {selectedFile && (
                                <p className="mt-2 text-blue-600 text-sm">
                                    ✓ {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </label>
                    {uploadError &&(
                        <p className="text-red-500 text-sm mt-2">
                            {uploadError}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm mt-2">
                            {error}
                        </p>
                    )}
                    <Button
                    type="button"
                    className="mt-4"
                    onClick={handleUpload}
                    disabled={uploadLoading}
                    text={
                        uploadLoading?"Uploading...":"Upload Attachment"
                    }
                    />
                </div>
            )}
        <ConfirmModal 
        isOpen={showDeleteModal}
        title="Delete Attachment"
        message="Are you sure you want to delete this attachment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        />
        </div>
    );
}
export default TicketAttachments;