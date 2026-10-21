const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Approved • ${payload.ticket.title}`,

        text:
`Hello,

Great news! Your support request has been reviewed and approved by the administrator.

Ticket:
${payload.ticket.title}

${payload.reviewNotes
?`Review Notes:
${payload.reviewNotes}

`
:""}Your ticket has now been closed.

Thank you for using AI Campus Helpdesk.`,

        html:layout({

            heading:"Your Ticket Has Been Successfully Closed",

            content:`

<p>Hello ${payload.recipient?.name || "Student"},</p>

<p>
Your support request has been reviewed by an administrator and the submitted resolution has been approved.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Status</b><br>

Closed

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
No further action is required.
If you experience the same issue again, you're always welcome to create a new support request.
</p>

`,

            actionText:"View Dashboard",

            actionUrl:`${process.env.FRONTEND_URL}/student/dashboard`

        })

    };
};