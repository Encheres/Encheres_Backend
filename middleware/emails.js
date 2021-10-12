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

const sendContactUsEmail = async(data) =>{
    try{
        const response = await sgMail.send({
            to:process.env.SENDER_EMAIL,
            from:process.env.SENDER_EMAIL,
            templateId:process.env.CONTACT_US_EMAIL_TEMPELATE,
            personalizations:[{
                to:process.env.SENDER_EMAIL,
                dynamicTemplateData:{
                    subject:"Contact User",
                    name:data.name,
                    email:data.email,
                    req_type:data.category,
                    message:data.description,
                }
            }],
        })
    }catch(error){
        const errorMessage = error.response.body.errors[0].message;
        console.log(errorMessage);
        throw new Error(errorMessage);
        
    }
}

module.exports = {
    sendPasswordResetEmail,
    sendContactUsEmail
}
