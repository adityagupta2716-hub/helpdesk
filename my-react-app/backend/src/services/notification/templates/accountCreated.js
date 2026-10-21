const layout=require("./layout.js");
module.exports=function({

    user,

    temporaryPassword

})
{
    return{

        subject:"Welcome to AI Campus Helpdesk",

        text:
`Hello ${user.name},

Welcome to AI Campus Helpdesk.

Your account has been created successfully.

Login Email:
${user.email}

Temporary Password:
${temporaryPassword}

Please log in using these credentials.

For security reasons, we strongly recommend changing your password immediately after logging in.

Regards,

AI Campus Helpdesk
`,

        html:
`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body{

    font-family:Arial,Helvetica,sans-serif;

    background:#f5f7fb;

    padding:40px;

}

.container{

    max-width:700px;

    margin:auto;

    background:white;

    border-radius:12px;

    border:1px solid #e5e7eb;

    padding:40px;

}

.title{

    font-size:26px;

    color:#2563eb;

    font-weight:bold;

    margin-bottom:24px;

}

.card{

    background:#f9fafb;

    padding:20px;

    border-radius:10px;

    margin:20px 0;

}

.label{

    font-weight:bold;

}

.footer{

    margin-top:32px;

    color:#6b7280;

    font-size:14px;

}

</style>

</head>

<body>

<div class="container">

<div class="title">

Welcome to AI Campus Helpdesk

</div>

<p>

Hello <strong>${user.name}</strong>,

</p>

<p>

Your account has been successfully created.

</p>

<div class="card">

<p>

<span class="label">

Email

</span>

<br>

${user.email}

</p>

<p>

<span class="label">

Temporary Password

</span>

<br>

${temporaryPassword}

</p>

</div>

<p>

Please sign in using the above credentials.

</p>

<p>

For security reasons, change your password immediately after your first login.

</p>

<div class="footer">

AI Campus Helpdesk

</div>

</div>

</body>

</html>
`

    };

};