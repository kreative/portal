const AWS = require("aws-sdk");

class Postage {

    constructor() {
        this.mailer = new AWS.SES({
            apiVersion: '2010-12-10',
            region: process.env.AWS_SES_REGION,
            accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
        });
        this.fromAddr = "notify@portal.kreativemail.com";
    }

    sendEmail(information) {
        const toAddr = information.to;
        const replyTo = information.replyTo;
        const subject = information.subject;
        const body = information.body;

        return new Promise((resolve, reject) => {
            this.mailer.sendEmail({
                Destination: {
                    ToAddresses: [toAddr]
                },
                ReplyToAddresses: [replyTo],
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: body
                        }
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: subject
                    }
                },
                Source: this.fromAddr
            })
            .promise()
            .then(res => resolve(res))
            .catch(err => reject(err));
        });
    }
}

module.exports = Postage;