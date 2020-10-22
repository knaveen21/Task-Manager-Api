const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// TODO --To send a mail on user signup ---
const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from:'nk21011996@gmail.com',
        subject:'Welcome to send grid',
        text: `Welcome to the App, ${name}, Let me know how you get along the app.`
    
    
    })
}

// TODO --To send a mail on user deletion

const sendCancelationEmail = (email, name) => {

    sgMail.send({
        to: email,
        from:'nk21011996@gmail.com',
        subject:'Sorry, to see you go',
        text: `Thank You, ${name}, for using our services.`
    
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}