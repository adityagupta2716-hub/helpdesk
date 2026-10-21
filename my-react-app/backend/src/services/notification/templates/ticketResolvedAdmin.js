const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`Resolution Ready For Review • ${payload.ticket.title}`,

        text:
`A staff member has marked a ticket as resolved.

Ticket:
${payload.ticket.title}

Staff:
${payload.staff.name}

The ticket is now awaiting administrator review.`,

        html:layout({

            heading:"Ticket Awaiting Administrator Review",

            content:`

<p>Hello Administrator,</p>

<p>
A staff member has completed work on a support request and marked it as resolved.
</p>

<div class="card">

<b>Ticket</b><br>

${payload.ticket.title}

<br><br>

<b>Resolved By</b><br>

${payload.staff.name}

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
Please review the submitted resolution and either approve it to close the ticket or reject it if additional work is required.
</p>

`,

            actionText:"Review Ticket",

            actionUrl:`${process.env.FRONTEND_URL}/admin/tickets`

        })

    };
};