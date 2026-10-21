const Comment=require("../models/Comment.js");
const Ticket=require("../models/Ticket.js");

const TicketRealtimeService=require("../services/realtime/TicketRealtimeService.js");

const addComment=async(req,res)=>{
    try{
        const{
            message,
            isInternal
        }=req.body;
    
    const ticket=await Ticket.findById(req.params.ticketId);
    if(!ticket)
    {
        return res.status(404).json({
            message:"Ticket not found"
        });
    }
    if(ticket.status==="Canceled")
    {
        return res.status(400).json({
            message:"Cannot add comments to a cancelled ticket"
        });
    }
    const comment=await Comment.create({
        ticket:ticket._id,
        user:req.user._id,
        message,
        isInternal
    });
    const populatedComment=await Comment.findById(comment._id)
    .populate(
        "user",
        "name role"
    );

    TicketRealtimeService.emitCommentCreated(
        populatedComment.toObject()
    );

    res.status(201).json({
        message:"Comment added successfully",
        comment:populatedComment
    });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const getComments=async(req,res)=>{
    try{
        let query={ticket:req.params.ticketId};
        if(req.user.role==="student")
        {
            query.isInternal=false;
        }
        const comments=await Comment.find(query)
        .populate("user","name role").sort({createdAt:1});

        res.status(200).json({
            count:comments.length,
            comments
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const deleteComment=async(req,res)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);
        if(!comment)
        {
            return res.status(404).json({
                message:"Comment not found"
            });
        }
        const isOwner=comment.user?.toString()===req.user._id.toString();
        const isAdmin=req.user.role==="admin";
        if(!isOwner && !isAdmin)
        {
            return res.status(403).json({
                message:"Not authorized to delete this comment"
            });
        }
        await comment.deleteOne();

        TicketRealtimeService.emitCommentDeleted(
            comment.ticket,
            comment._id
        );

        return res.status(200).json({
            message:"Comment deleted successfully",
            commentId:req.params.commentId
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports={
    addComment,
    getComments,
    deleteComment
};

