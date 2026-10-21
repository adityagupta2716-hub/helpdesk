const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Your Ticket Requires Additional Work • ${payload.ticket.title}`,

        text:
`Hello,

Your support request is still being worked on.

The administrator has requested additional work before the issue can be closed.

Ticket:
${payload.ticket.title}

The assigned staff member will continue working on your request.`,

        html:layout({

            heading:"Your Ticket Has Been Reopened",

            content:`

<p>Hello ${payload.recipient?.name || "Student"},</p>

<p>
Your support request has been reviewed by an administrator.
Additional work is required before the issue can be marked as completed.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Status</b><br>

In Progress

${
payload.reviewNotes
?`

<br><br>

<b>Administrator Review</b><br>

${payload.reviewNotes}

`
:""
}

</div>

<p>
The assigned staff member has been notified and will continue working on your request.
You will receive another update once progress has been made.
</p>

`,

            actionText:"Track Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/student/tickets`

        })

    };
};