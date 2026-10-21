const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Ticket Closed • ${payload.ticket.title}`,

        text:
`Hello,

Your support request has been successfully completed.

Ticket:
${payload.ticket.title}

Thank you for using AI Campus Helpdesk.`,

        html:layout({

            heading:"Your Ticket Has Been Closed",

            content:`

<p>Hello,</p>

<p>
Your support request has been reviewed and officially closed.
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

<b>Administrator Notes</b><br>

${payload.reviewNotes}

`
:""
}

</div>

<p>
No further action is required.
If you experience the same issue again, you're welcome to submit a new support request.
</p>

`,

            actionText:"Open Dashboard",

            actionUrl:`${process.env.FRONTEND_URL}/student/dashboard`

        })

    };
};