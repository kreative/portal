const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

class Signal  {

    constructor() {
        this.messages = twilio(accountSid, authToken).messages;
        this.portalPhone = "+18017428992";
    }

    sendMessage(data) {
        const body = data.body;
        const to = data.to;
        const from = this.portalPhone;

        return new Promise((resolve, reject) => {
            this.messages.create({body,to,from})
            .catch(err => reject(err))
            .then(message => resolve(message));
        });
    }
}

module.exports = Signal;