const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Your Ticket Has Been Assigned`,

        text:
`Hello ${payload.ticket.createdBy?.name || "Student"},

Your ticket "${payload.ticket.title}" has been assigned to ${payload.staff.name}.

The assigned staff member will begin working on your request shortly.

You can log in to AI Campus Helpdesk to track the progress of your ticket.`,

        html:layout({

            heading:"Your Ticket Has Been Assigned",

            content:`

<p>Hello,</p>

<p>Your support request has now been assigned to a staff member.</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Assigned Staff</b><br>

${payload.staff.name}

</div>

<p>
The assigned staff member will begin reviewing your issue shortly.
You will receive another notification whenever the ticket status changes.
</p>

`,

            actionText:"View Ticket",

            actionUrl:process.env.FRONTEND_URL+"/student/tickets"

        })

    };
};