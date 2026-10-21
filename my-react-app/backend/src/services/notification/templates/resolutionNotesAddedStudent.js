const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Update • ${payload.ticket.title}`,

        text:
`Hello,

The assigned staff member has added resolution notes to your support request.

Ticket:
${payload.ticket.title}

Please log in to AI Campus Helpdesk to review the latest update.`,

        html:layout({

            heading:"Resolution Notes Added",

            content:`

<p>Hello ${payload.recipient?.name || "Student"},</p>

<p>
The assigned staff member has added resolution notes to your support request.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

${
payload.ticket.resolutionNotes
?`

<br><br>

<b>Resolution Notes</b><br>

${payload.ticket.resolutionNotes}

`
:""
}

</div>

<p>
These notes explain the work completed so far. Your ticket remains active until the issue has been fully reviewed and closed.
</p>

`,

            actionText:"View Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/student/tickets`

        })

    };
};