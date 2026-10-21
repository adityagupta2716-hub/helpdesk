const Notification=require("../../models/Notification");
const User=require("../../models/User");

const EmailService=require("./EmailService");
const {getIO}=require("../../socket/SocketService");

const EVENT_CONFIG={

    "account.created":{
        title:()=>"Welcome to AI Campus Helpdesk",
        message:payload=>
            `Welcome ${payload.user.name}! Your account has been created.`
    },

    "ticket.created.student":{
        title:()=>"Ticket Created",
        message:payload=>
            `Your ticket "${payload.ticket.title}" has been created successfully.`
    },

    "ticket.created.admin":{
        title:()=>"New Ticket Created",
        message:payload=>
            `${payload.actor.name} created "${payload.ticket.title}".`
    },

    "ticket.assigned.student":{
        title:payload=>
            payload.isReassignment
            ?"Ticket Reassigned"
            :"Ticket Assigned",

        message:payload=>
            payload.isReassignment
            ?`Your ticket "${payload.ticket.title}" has been reassigned to ${payload.staff.name}.`
            :`Your ticket "${payload.ticket.title}" has been assigned to ${payload.staff.name}.`
    },

    "ticket.assigned.staff":{
        title:()=>"New Ticket Assigned",

        message:payload=>
            `Ticket "${payload.ticket.title}" has been assigned to you.`
    },

    "ticket.reassigned.staff":{
        title:()=>"Ticket Reassigned",

        message:payload=>
            `Ticket "${payload.ticket.title}" has been reassigned to you.`
    },

    "ticket.reassigned.previousStaff":{
        title:()=>"Ticket Reassigned",

        message:payload=>
            `Ticket "${payload.ticket.title}" has been reassigned to ${payload.staff.name}.`
    },

    "ticket.updated.admin":{
        title:()=>"Ticket Updated",

        message:payload=>
            `${payload.actor.name} updated "${payload.ticket.title}".`
    },

    "ticket.updated.staff":{
        title:()=>"Assigned Ticket Updated",

        message:payload=>
            `The student updated "${payload.ticket.title}".`
    },

    "ticket.resolved.student":{
        title:()=>"Ticket Resolved",

        message:payload=>
            `Your ticket "${payload.ticket.title}" has been resolved.`
    },

    "ticket.resolved.staff":{
        title:()=>"Resolution Submitted",

        message:payload=>
            `Resolution submitted for "${payload.ticket.title}".`
    },

    "ticket.closed.student":{
        title:()=>"Ticket Closed",

        message:payload=>
            `Your ticket "${payload.ticket.title}" has been closed.`
    },

    "ticket.closed.staff":{
        title:()=>"Resolution Approved",

        message:payload=>
            `Your resolution for "${payload.ticket.title}" has been approved.`
    },

    "ticket.cancelled.student":{
        title:()=>"Ticket Cancelled",

        message:payload=>
            `Your ticket "${payload.ticket.title}" has been cancelled.`
    },

    "ticket.cancelled.staff":{
        title:()=>"Assigned Ticket Cancelled",

        message:payload=>
            `Ticket "${payload.ticket.title}" has been cancelled.`
    },

    "ticket.cancelled.admin":{
        title:()=>"Ticket Cancelled",

        message:payload=>
            `${payload.actor.name} cancelled "${payload.ticket.title}".`
    },

    "ticket.review.approved.student":{
        title:()=>"Ticket Closed",

        message:payload=>
            `Your ticket "${payload.ticket.title}" has been approved and closed.`
    },

    "ticket.review.approved.staff":{
        title:()=>"Resolution Approved",

        message:payload=>
            `Your resolution for "${payload.ticket.title}" has been approved.`
    },

    "ticket.review.rejected.student":{
        title:()=>"Ticket Reopened",

        message:payload=>
            `Your ticket "${payload.ticket.title}" requires further work.`
    },

    "ticket.review.rejected.staff":{
        title:()=>"Resolution Rejected",

        message:payload=>
            `Your resolution for "${payload.ticket.title}" was rejected.`
    }

};

async function notify({

    event,

    userId,

    payload={}

})
{
    const normalizedPayload={

        ticket:null,

        actor:null,

        recipient:null,

        staff:null,

        previousStaff:null,

        reason:null,

        reviewNotes:null,

        isReassignment:false,

        user:null,

        temporaryPassword:null,

        ...payload

    };
    const config=EVENT_CONFIG[event];
    

    if(!config)
    {
        throw new Error(
            `Unknown notification event "${event}".`
        );
    }
    
    const user=await User.findById(userId)
    .select("name email");

    if(!user)
    {
        throw new Error(
            "Recipient not found."
        );
    }
    
   normalizedPayload.recipient={

        id:user._id.toString(),

        name:user.name,

        email:user.email

    };

    const title=config.title(normalizedPayload);

    const message=config.message(normalizedPayload);

    const notification=await Notification.create({

        user:user._id,

        title,

        message

    });

    const io=getIO();

    if(io)
    {
        io.to(user._id.toString()).emit(

            "notification",

            notification.toObject()

        );
    }

    io.to(user._id.toString()).emit(

        "notification",

        notification.toObject()

    );

    EmailService.send({

        event,

        to:user.email,

        payload:normalizedPayload

    }).catch(error=>{

        console.error(
            "Email notification failed:",
            error.message
        );

    });

    return {
        notification,
        recipient:normalizedPayload.recipient
    };
}

module.exports={
    notify
};