module.exports=function({

    title,

    heading,

    content,

    actionText,

    actionUrl

})
{
    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body{

    margin:0;

    padding:40px;

    background:#eef2ff;

    font-family:Arial,Helvetica,sans-serif;

}

.container{

    max-width:680px;

    margin:auto;

    background:#ffffff;

    border-radius:14px;

    overflow:hidden;

    box-shadow:0 8px 25px rgba(0,0,0,.08);

}

.header{

    background:#2563eb;

    color:white;

    padding:28px;

    text-align:center;

}

.logo{

    font-size:26px;

    font-weight:bold;

}

.body{

    padding:32px;

    color:#374151;

    line-height:1.7;

}

.card{

    background:#f9fafb;

    border-left:5px solid #2563eb;

    padding:20px;

    border-radius:10px;

    margin:24px 0;

}

.button{

    display:inline-block;

    margin-top:20px;

    background:#2563eb;

    color:white !important;

    padding:14px 26px;

    text-decoration:none;

    border-radius:8px;

    font-weight:bold;

}

.footer{

    background:#f3f4f6;

    padding:20px;

    text-align:center;

    color:#6b7280;

    font-size:13px;

}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="logo">

AI Campus Helpdesk

</div>

</div>

<div class="body">

<h2>${heading}</h2>

${content}

${
actionUrl
?
`<a class="button" href="${actionUrl}">
${actionText}
</a>`
:
""
}

</div>

<div class="footer">

This is an automated email.

Please do not reply.

<br><br>

© AI Campus Helpdesk

</div>

</div>

</body>

</html>
`;
}