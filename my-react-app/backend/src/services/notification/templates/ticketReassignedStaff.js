const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:"Ticket Reassigned To You",

        text:
`A ticket has been reassigned to you.

Ticket:
${payload.ticket.title}`,

        html:layout({

            heading:"A Ticket Has Been Reassigned To You",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>
A support ticket has been reassigned to you.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Priority</b><br>

${payload.ticket.priority}

</div>

<p>
Please review the ticket details and continue handling the request.
</p>

`,

            actionText:"View Ticket",

            actionUrl:process.env.FRONTEND_URL+"/staff/tickets"

        })

    };
};