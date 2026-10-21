const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Assigned Ticket Updated • ${payload.ticket.title}`,

        text:
`A student updated a ticket assigned to you.

Ticket:
${payload.ticket.title}`,

        html:layout({

            heading:"Assigned Ticket Updated",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>
The student has updated the details of a ticket currently assigned to you.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Priority</b><br>

${payload.ticket.priority}

</div>

<p>
Please review the updated information before continuing your work.
</p>

`,

            actionText:"Open Assigned Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};