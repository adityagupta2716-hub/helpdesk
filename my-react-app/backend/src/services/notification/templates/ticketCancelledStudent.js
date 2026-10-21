const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Support Request Cancelled • ${payload.ticket.title}`,

        text:
`Hello,

Your support request has been cancelled.

Ticket:
${payload.ticket.title}

Reason:
${payload.reason || "No reason provided."}

If you still require assistance, you may create a new support request.

AI Campus Helpdesk Team`,

        html:layout({

            heading:"Your Support Request Has Been Cancelled",

            content:`

<p>Hello,</p>

<p>
Your support request has been cancelled.
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
If you continue experiencing the issue, you can submit a new support request at any time.
</p>

`,

            actionText:"Create New Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/student/create-ticket`

        })

    };
};