const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Ticket Reassigned • ${payload.ticket.title}`,

        text:
`A ticket has been reassigned.

Ticket:
${payload.ticket.title}

From:
${payload.previousStaff.name}

To:
${payload.staff.name}`,

        html:layout({

            heading:"Ticket Reassigned",

            content:`

<p>Hello Administrator,</p>

<p>
A ticket has been reassigned within the department.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Previous Staff Member</b><br>

${payload.previousStaff.name}

<br><br>

<b>New Staff Member</b><br>

${payload.staff.name}

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
This reassignment has already been completed successfully. No further action is required unless additional review is needed.
</p>

`,

            actionText:"View Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/admin/tickets`

        })

    };
};