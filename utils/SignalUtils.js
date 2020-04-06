const sms = require("../config/sms");

const PORTAL_SIGNAL_NUMBER = process.env.PORTAL_SIGNAL_NUMBER;

exports.sendResetCode = (tel, code, fname) => {
    sms.messages.create({
        from: PORTAL_SIGNAL_NUMBER,
        to: tel,
        body: `${fname}, your verification code is ${code}`
    })
    .then(message => {
        return message
    });
};