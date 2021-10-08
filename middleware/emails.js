const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = (email, name, url) =>{
    sgMail.send({
        to:email,
        from:process.env.SENDER_EMAIL,
        templateId:process.env.FORGOT_PASSWORD_EMAIL_TEMPELATE,
        personalizations:[{
            to:[{email:email}],
            dynamicTemplateData:{
                url:url,
                subject:'Password Reset',
                disclaimer:'This is an automated email. Please do not reply to this email.',
                name:name
            }
        }],
    }).then((response) => {
        console.log(response[0].Response.statusCode);
    }).catch((error) => {
        throw new Error(error);
    });
}

module.exports = {
    sendPasswordResetEmail
}
