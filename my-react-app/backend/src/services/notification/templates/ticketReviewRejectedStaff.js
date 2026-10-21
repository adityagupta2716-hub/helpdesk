const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Requires Revision • ${payload.ticket.title}`,

        text:
`Your submitted resolution has been reviewed.

Ticket:
${payload.ticket.title}

The administrator has requested additional work before the ticket can be closed.`,

        html:layout({

            heading:"Resolution Requires Additional Work",

            content:`

<p>Hello ${payload.recipient?.name || payload.staff?.name || "Staff"},</p>

<p>
The administrator has reviewed your submitted resolution and requested further work.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

${
payload.reviewNotes
?`

<br><br>

<b>Administrator Feedback</b><br>

${payload.reviewNotes}

`
:""
}

</div>

<p>
Please review the administrator's comments, update the ticket accordingly, and submit a revised resolution when the issue has been fully addressed.
</p>

`,

            actionText:"Continue Working",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};