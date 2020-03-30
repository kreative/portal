const mail = require("../config/mail");

exports.emailTest = (req, res) => {
    const emailAddress = req.params.email;

    mail.messages().send({
        from: 'hi@portal.kreativemail.com',
        to: emailAddress,
        subject: 'Join the Federation',
        text: "Be a part of something bigger. Come be radical."
    }, 
    (err, body) => {
        if (err) {
            console.log(err);
            res.json({status: 505});
        }
        console.log(body);
        res.json({status: 202})
    });
};