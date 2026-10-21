const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Your Ticket Has Been Resolved • ${payload.ticket.title}`,

        text:
`Hello,

Your support request has been marked as resolved.

Ticket:
${payload.ticket.title}

The assigned staff member believes the issue has been resolved.

Please review the solution. If everything looks good, the administrator will complete the review and close the ticket.

Thank you,
AI Campus Helpdesk Team`,

        html:layout({

            heading:"Your Ticket Has Been Resolved",

            content:`

<p>Hello,</p>

<p>
Good news! The assigned staff member has marked your support request as resolved.
</p>

<div class="card">

<b>Ticket</b><br>
${payload.ticket.title}

<br><br>

<b>Status</b><br>
Resolved

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
Your ticket will now be reviewed by an administrator before it is officially closed.
If additional work is required, the ticket may be reopened.
</p>

`,

            actionText:"View Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/student/tickets`

        })

    };
};