const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Support Request Received • ${payload.ticket.title}`,

        text:
`Hello ${payload.actor?.name || payload.user?.name || "Student"},

We've successfully received your support request.

Ticket Title:
${payload.ticket.title}

Department:
${payload.ticket.department}

Category:
${payload.ticket.category}

Priority:
${payload.ticket.priority}

Current Status:
Open

Our support team will review your request shortly.
You'll receive notifications whenever your ticket progresses.

Thank you,
AI Campus Helpdesk Team`,

        html:layout({

            heading:"We've Received Your Support Request",

            content:`

<p>Hello,</p>

<p>
Thank you for contacting AI Campus Helpdesk.
Your support request has been successfully submitted and is now awaiting review.
</p>

<div class="card">

<b>Ticket Title</b><br>
${payload.ticket.title}

<br><br>

<b>Department</b><br>
${payload.ticket.department}

<br><br>

<b>Category</b><br>
${payload.ticket.category}

<br><br>

<b>Priority</b><br>
${payload.ticket.priority}

<br><br>

<b>Current Status</b><br>
Open

</div>

<p>
Your request will now be reviewed by the appropriate administrator.
Once assigned, you'll receive another notification with the assigned staff member.
</p>

<p>
You can track your ticket anytime from your dashboard.
</p>

`,

            actionText:"View My Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/student/tickets`

        })

    };
};