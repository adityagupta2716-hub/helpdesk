const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:"Your Ticket Has Been Reassigned",

        text:
`Your ticket "${payload.ticket.title}" has been reassigned.

New Staff Member:
${payload.staff.name}`,

        html:layout({

            heading:"Your Ticket Has Been Reassigned",

            content:`

<p>Hello,</p>

<p>
Your support request has been reassigned to another staff member.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Previous Staff</b><br>

${payload.previousStaff.name}

<br><br>

<b>New Staff</b><br>

${payload.staff.name}

</div>

<p>
This reassignment helps ensure your request is handled efficiently.
</p>

`,

            actionText:"Track Ticket",

            actionUrl:process.env.FRONTEND_URL+"/student/tickets"

        })

    };
};