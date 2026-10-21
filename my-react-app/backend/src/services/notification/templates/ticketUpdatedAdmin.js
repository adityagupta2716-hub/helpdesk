const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Ticket Updated • ${payload.ticket.title}`,

        text:
`${payload.actor.name} updated a support request.

Ticket:
${payload.ticket.title}`,

        html:layout({

            heading:"Support Request Updated",

            content:`

<p>Hello Administrator,</p>

<p>
A student has updated an existing support request.
</p>

<div class="card">

<b>Student</b><br>

${payload.actor.name}

<br><br>

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Priority</b><br>

${payload.ticket.priority}

</div>

<p>
Please review the updated information if necessary.
</p>

`,

            actionText:"Review Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/admin/tickets`

        })

    };
};