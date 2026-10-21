const layout=require("./layout");

module.exports=function(payload)
{
    return{

        subject:`New Support Ticket • ${payload.ticket.title}`,

        text:
`A new support request has been submitted.

Student:
${payload.actor.name}

Title:
${payload.ticket.title}

Department:
${payload.ticket.department}

Category:
${payload.ticket.category}

Priority:
${payload.ticket.priority}

Please assign the ticket to the appropriate staff member.`,

        html:layout({

            heading:"A New Support Ticket Has Been Submitted",

            content:`

<p>Hello Administrator,</p>

<p>
A new support request has been submitted and is awaiting assignment.
</p>

<div class="card">

<b>Student</b><br>
${payload.actor.name}

<br><br>

<b>Email</b><br>
${payload.actor.email}

<br><br>

<b>Ticket</b><br>
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

</div>

<p>
Please review the request and assign it to the most appropriate staff member.
Prompt assignment helps reduce response time and improves the student experience.
</p>

`,

            actionText:"Open Admin Dashboard",

            actionUrl:`${process.env.FRONTEND_URL}/admin/tickets`

        })

    };
};