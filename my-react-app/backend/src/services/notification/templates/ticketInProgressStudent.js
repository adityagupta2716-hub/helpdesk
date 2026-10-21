const layout=require("./layout");

module.exports=function(payload)
{
    return{
        subject:`Work Started > ${payload.ticket.title}`,

        text:
`Hello ${payload.recipient.name},

Good news! Your support request is now being worked on.

Ticket:
${payload.ticket.title}

Assigned Staff:
${payload.staff.name}

We'll notify you again when the issue has been resolved.

Regards,
AI Campus Helpdesk`,

        html:layout({
            heading:"Your Ticket is Now in Progress",

            content:`
<p>Hello ${payload.recipient.name},</p>

<p>
A staff memever has started working on your support request.
</P>

<div class="card">

<b>Ticket</><br>


${payload.staff.name}

</div>

<p>
Our support team is actively investigating and working on your issue.
You'll receive another notification once the ticket has been resolved or if additional information is required.
</P

<p>
Thank you for your patience.
</p>

`,
            actionText:"View Ticket",
            actionUrl:`${process.env.FRONTEND_URL}/student/tickets`
        })
    };
};