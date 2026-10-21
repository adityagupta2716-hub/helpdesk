const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:"Ticket Reassigned",

        text:
`The following ticket has been reassigned to another staff member.

${payload.ticket.title}`,

        html:layout({

            heading:"Ticket Reassigned",

            content:`

<p>Hello ${payload.previousStaff.name},</p>

<p>
This ticket is no longer assigned to you.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>New Staff Member</b><br>

${payload.staff.name}

${
payload.reason
?`<br><br><b>Reason</b><br>${payload.reason}`
:""
}

</div>

<p>
No further action is required from your side.
</p>

`,

            actionText:"View Tickets",

            actionUrl:process.env.FRONTEND_URL+"/staff/tickets"

        })

    };
};