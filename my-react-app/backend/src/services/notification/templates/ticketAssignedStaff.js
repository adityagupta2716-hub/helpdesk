const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:"New Ticket Assigned",

        text:
`A new ticket has been assigned to you.

Ticket:
${payload.ticket.title}

Please review and begin working on it.`,

        html:layout({

            heading:"A New Ticket Has Been Assigned",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>A new support ticket has been assigned to you.</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Priority</b><br>

${payload.ticket.priority}

<br><br>

<b>Department</b><br>

${payload.ticket.department}

</div>

<p>
Please review the ticket and begin working on it as soon as possible.
</p>

`,

            actionText:"Open Assigned Tickets",

            actionUrl:process.env.FRONTEND_URL+"/staff/tickets"

        })

    };
};