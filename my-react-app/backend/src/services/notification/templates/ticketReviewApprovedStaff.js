const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Approved • ${payload.ticket.title}`,

        text:
`Congratulations!

Your submitted resolution has been approved.

Ticket:
${payload.ticket.title}

Keep up the great work!`,

        html:layout({

            heading:"Your Resolution Has Been Approved",

            content:`

<p>Hello ${payload.recipient?.name || payload.staff?.name || "Staff"},</p>

<p>
The administrator has reviewed your submitted resolution and approved it.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

${
payload.reviewNotes
?`

<br><br>

<b>Review Notes</b><br>

${payload.reviewNotes}

`
:""
}

</div>

<p>
The ticket has now been successfully completed.
Thank you for your contribution towards resolving student issues.
</p>

`,

            actionText:"View Assigned Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};