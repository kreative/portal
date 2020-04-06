const mail = require("../config/mail");

exports.sendWelcomeEmail = (fname, email) => {
    const data = {
        from: 'Armaan Gupta armaan@portal.kreativemail.com',
        to: email,
        reply_to: "armaan@kreative.im",
        subject: 'Welcome to Kreative',
        html: "Welcome "+fname+",<br><br>You just created an account with Kreative using Portal, and we couldn't be happier.<br><br>Talk to you soon,<br>Armaan"
    }
    
    mail.messages().send(data, (err, body) => {
        if (err) {
            // as the calling controller method (accounts.signup)
            // will not be handling an error, it should only be logged
            throw new Error(err);
        }
        // the calling method will probably not use this
        // but it's there if need be
        return body;
    });
};

// still need to add location information using ip info into the actual email
exports.sendLoginNotificationEmail = (fname, email, ipinfo, timestamp) => {
    const data = {
        from: 'Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Did you just login?",
        html: fname+",<br><br> Your account was just logged into. If this was you, you can ignore this email. If not, contact us asap."
    }

    mail.messages().send(data, (err, body) => {
        if (err) {
            throw new Error(err);
        }
        return body;
    });
};

exports.sendResetCode = (email, resetCode, fname) => {
    const data = {
        from: 'Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Reset your password "+fname,
        html: `Hi ${fname},<br><br>Your verification code is ${resetCode}<br><br>`
    };

    mail.messages().send(data, (err, body) => {
        if (err) {
            throw new Error(err);
        }
        return body;
    });
};

exports.sendPasswordResetNotification = (email, fname) => {
    const data = {
        from: 'Portal notify@portal.kreativemail.com',
        to: email,
        subject: "Did you just reset your password?",
        html: fname+",<br><br>The password for your Kreative Portal account was just reset. If this was you, ignore this email. If not, contact us asap"
    };

    mail.messages().send(data, (err, body) => {
        if (err) {
            throw new Error(err);
        }
        return body;
    });
};

exports.sendNewOrganizationCreatedEmail = (adminEmail, orgName) => {
    const data = {
        from: 'Portal notify@portal.kreativemail.com',
        to: adminEmail,
        subject: "Your Organization, "+orgName+", was just created",
        html: "Good job on creating your organization. Have fun, stay radical."
    };

    mail.messages().send(data, (err, body) => {
        if (err) {
            throw new Error(err);
        }
        return body;
    });
};

exports.sendNewAppchainCreatedEmail = (adminEmail, appName) => {
    const data = {
        from: 'Portal notify@portal.kreativemail.com',
        to: adminEmail,
        subject: "Your Appchain for "+appName+" was just created",
        html: "Good job on adding your App to the Portal DevHub. Have fun, stay radical."
    };

    mail.messages().send(data, (err, body) => {
        if (err) {
            throw new Error(err);
        }
        return body;
    });
};