const {
    getTransporter
}=require("./MailProvider.js");

const {
    getTemplate
}=require("./templates");

async function send({
    event,
    to,
    payload
})
{
    if(!to)
    {
        throw new Error(
            "Recipient email is required."
        );
    }

    const templateBuilder=getTemplate(event);

    const {
        subject,
        text,
        html
    }=templateBuilder(payload);

    const transporter=getTransporter();

    await transporter.sendMail({
        from:process.env.MAIL_FROM,
        to,
        subject,
        text,
        html
    });

    return{
        success:true,
        recipient:to,
        subject
    };
}

module.exports={
    send
};