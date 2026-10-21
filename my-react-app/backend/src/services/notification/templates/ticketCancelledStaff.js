const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Assigned Ticket Cancelled • ${payload.ticket.title}`,

        text:
`The following ticket has been cancelled.

Ticket:
${payload.ticket.title}

No further action is required.`,

        html:layout({

            heading:"Assigned Ticket Cancelled",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>
A ticket assigned to you has been cancelled.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

${
payload.reason
?`

<br><br>

<b>Reason</b><br>

${payload.reason}

`
:""
}

</div>

<p>
No further work is required for this ticket.
</p>

`,

            actionText:"View Assigned Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};