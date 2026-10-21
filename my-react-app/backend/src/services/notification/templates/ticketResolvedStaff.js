const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Submitted • ${payload.ticket.title}`,

        text:
`Your resolution has been submitted.

Ticket:
${payload.ticket.title}

The ticket is now awaiting administrator review.`,

        html:layout({

            heading:"Resolution Successfully Submitted",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>
Your resolution has been recorded successfully.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Current Status</b><br>

Awaiting Administrator Review

</div>

<p>
An administrator will now review your work.
Once reviewed, you'll receive another notification informing you whether the resolution has been approved or requires further work.
</p>

`,

            actionText:"View Assigned Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};