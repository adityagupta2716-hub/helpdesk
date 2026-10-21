const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Approved • ${payload.ticket.title}`,

        text:
`Congratulations!

Your submitted resolution has been approved.

Ticket:
${payload.ticket.title}`,

        html:layout({

            heading:"Resolution Approved",

            content:`

<p>Hello ${payload.staff.name},</p>

<p>
Great work!
The administrator has approved your submitted resolution.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Final Status</b><br>

Closed

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
The support request has now been completed successfully.
Thank you for helping improve the student experience.
</p>

`,

            actionText:"View Assigned Tickets",

            actionUrl:`${process.env.FRONTEND_URL}/staff/tickets`

        })

    };
};