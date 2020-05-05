const Postage = require("./postage");
const postage = new Postage();

exports.sendWelcomeEmail = (fname, email) => {
    const data = {
        from: 'Armaan Gupta armaan@portal.kreativemail.com',
        to: email,
        replyTo: "armaan@kreative.im",
        subject: 'Welcome to Kreative',
        body: "Welcome "+fname+",<br><br>You just created an account with Kreative using Portal, and we couldn't be happier.<br><br>Talk to you soon,<br>Armaan"
    }

    postage.sendEmail(data)
    .catch(err => {throw new Error({err, email,emailType:"welcome_email"})})
    .then(res => {return res});
};

// still need to add location information using ip info into the actual email
exports.sendLoginNotificationEmail = (fname, email, ipinfo, timestamp) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        replyTo: 'armaan@kreative.im',
        to: email,
        subject: "Did you just login?",
        body: fname+",<br><br> Your account was just logged into. If this was you, you can ignore this email. If not, contact us asap."
    }

    postage.sendEmail(data)
    .catch(err => {throw new Error(err)})
    .then(res => {return res});
};

exports.sendResetCode = (email, resetCode, fname) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Reset your password "+fname,
        body: `Hi ${fname},<br><br>Your verification code is ${resetCode}<br><br>`
    };

    postage.sendEmail(data)
    .catch(err => {throw new Error(err)})
    .then(res => {return res});
};

exports.sendPasswordResetNotification = (email, fname) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Did you just reset your password?",
        body: fname+",<br><br>The password for your Kreative Portal account was just reset. If this was you, ignore this email. If not, contact us asap"
    };

    postage.sendEmail(data)
    .catch(err => {throw new Error(err)})
    .then(res => {return res});
};

exports.sendNewOrganizationCreatedEmail = (adminEmail, orgName) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        to: adminEmail,
        subject: "Your Organization, "+orgName+", was just created",
        body: "Good job on creating your organization. Have fun, stay radical."
    };

    postage.sendEmail(data)
    .catch(err => {throw new Error(err)})
    .then(res => {return res});
};

exports.sendNewAppchainCreatedEmail = (adminEmail, appName) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        to: adminEmail,
        subject: "Your Appchain for "+appName+" was just created",
        body: "Good job on adding your App to the Portal DevHub. Have fun, stay radical."
    };

    postage.sendEmail(data)
    .catch(err => {throw new Error(err)})
    .then(res => {return res});
};

exports.sendEmailVerificationEmail = (email, verificationUrl) => {
    const data = {
        from: 'Kreative Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Verify your email",
        body: `Verify you email by clicking <a href=${verificationUrl}>this link</a><br><br>Thanks!`
    };

    postage.sendEmail(data)
    .catch(err => {throw new Error({err,email,emailType:"email_verification"})})
    .catch(res => {return res});
}