const mongoose=require("mongoose");

const ticketActivitySchema=new mongoose.Schema(
{
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket"
    },

    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    action:String,
    description:String
},
{
    timestamps:true
}
);

module.exports=mongoose.model(
    "TicketActivity",
    ticketActivitySchema
);