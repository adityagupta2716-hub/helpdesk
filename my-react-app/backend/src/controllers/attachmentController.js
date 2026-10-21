const Attachment=require("../models/Attachment.js");
const cloudinary=require("../config/cloudinary.js");

const TicketRealtimeService=require("../services/realtime/TicketRealtimeService.js");

const uploadAttachment=async(req,res)=>{
    try{
        const{ticketId}=req.params;
        const attachment=await Attachment.create({
            ticket:ticketId,
            uploadedBy:req.user._id,
            fileName:req.file.originalname,
            fileUrl:req.file.path,
            cloudinaryId:req.file.filename,
            fileType:req.file.mimetype
        });

        const populatedAttachment=await Attachment.findById(attachment._id)
        .populate(
            "uploadedBy",
            "_id name role"
        );

        TicketRealtimeService.emitAttachmentUploaded(
            populatedAttachment
        );

        res.status(201).json({
            message:"Attachment uploaded",
            attachment:populatedAttachment
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const getTicketAttachments=async(req,res)=>{
    try{
        const attachments=await Attachment.find({
            ticket:req.params.ticketId
        }).populate("uploadedBy",
            "_id name role"
        ).sort({createdAt:-1});

        res.status(200).json({
            count:attachments.length,
            attachments
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const deleteAttachment=async(req,res)=>{
    try{
        const attachment=await Attachment.findById(req.params.attachmentId).populate("uploadedBy",
            "_id name role"
        );
        if(!attachment)
        {
            return res.status(404).json({
                message:"Attachment not found"
            });
        }
        const isOwner=attachment.uploadedBy._id.toString()===req.user._id.toString();
        const isAdmin=req.user.role==="admin";
        if(!isOwner && !isAdmin)
        {
            return res.status(403).json({
                message:"Not authorized to delete attachment"
            });
        }
        if(attachment.cloudinaryId)
        {
            await cloudinary.uploader.destroy(attachment.cloudinaryId);
        }
        await attachment.deleteOne();

        TicketRealtimeService.emitAttachmentDeleted(attachment.ticket,attachment._id);

        res.status(200).json({
            message:"Attachment deleted",
            attachmentId:req.params.attachmentId
        });


    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports={
    uploadAttachment,
    getTicketAttachments,
    deleteAttachment
};