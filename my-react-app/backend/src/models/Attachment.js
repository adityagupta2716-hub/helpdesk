const mongoose=require("mongoose");

const attachmentSchema=new mongoose.Schema(
{
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        required:true
    },

    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fileName:{
        type:String,
        required:true
    },

    fileUrl:{
        type:String,
    },

    cloudinaryId:{
        type:String
    },

    fileType:{
        type:String
    }
},
{
    timestamps:true
}
);

module.exports=mongoose.model(
    "Attachment",
    attachmentSchema
);