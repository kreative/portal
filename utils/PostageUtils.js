const mail = require("../config/mail");

exports.sendWelcomeEmail = (fname, email) => {
    const data = {
        from: 'Armaan Gupta armaan@portal.kreativemail.com',
        to: email,
        reply_to: "armaan@kreative.im",
        subject: 'Welcome to Kreative',
        html: "Welcome " + fname + ",<br><br>You just created an account with Kreative using Portal, and we couldn't be happier.<br><br>Talk to you soon,<br>Armaan"
    }
    
    mail.messages().send(data, (err, body) => {
        if (err) {
            // as the calling controller method (accounts.signup)
            // will not be handling an error, it should only be logged
            console.log(err)
        }
        // the calling method will probably not use this
        // but it's there if need be
        return body;
    });
}