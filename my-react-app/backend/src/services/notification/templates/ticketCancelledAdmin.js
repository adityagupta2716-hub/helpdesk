const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Ticket Cancelled • ${payload.ticket.title}`,

        text:
`${payload.actor.name} cancelled a support request.

Ticket:
${payload.ticket.title}`,

        html:layout({

            heading:"Support Request Cancelled",

            content:`

<p>Hello Administrator,</p>

<p>
A student has cancelled a support request.
</p>

<div class="card">

<b>Student</b><br>

${payload.actor.name}

<br><br>

<b>Ticket</b><br>

${payload.ticket.title}

</div>

<p>
The ticket has been marked as cancelled and requires no further action.
</p>

`,

            actionText:"Open Dashboard",

            actionUrl:`${process.env.FRONTEND_URL}/admin/tickets`

        })

    };
};