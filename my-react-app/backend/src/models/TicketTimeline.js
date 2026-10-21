const mongoose=require("mongoose");

const ticketTimelineSchema=new mongoose.Schema(
{
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    eventType:{
        type:String,
        enum:[
            "created",
            "assigned",
            "reassigned",
            "status",
            "resolution",
            "closed",
            "updated",
            "canceled",
            "review"
        ],
        required:true
    }
},
{
    timestamps:true
}
);

module.exports=mongoose.model(
    "TicketTimeline",
    ticketTimelineSchema
);