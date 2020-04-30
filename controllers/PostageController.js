const Postage = require("../services/postage");
const postage = new Postage();

exports.emailTest = (req, res) => {
    const emailAddress = req.params.email;

    postage.sendEmail({
        from: 'hi@portal.kreativemail.com',
        replyTo: 'armaan@kreative.im',
        to: emailAddress,
        subject: 'Join the Federation',
        body: "Be a part of something bigger. Come be radical."
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
    .then(resp => {
        console.log(resp);
        res.send(resp);
    })
};