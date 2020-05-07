const Postage = require("./postage");
const TemplateEngine = require("./templateEngine");

const postage = new Postage();
const templateEngine = new TemplateEngine("localhost:3000/postage_templates");

exports.emailTest = async (req, res) => {
    const emailAddress = req.params.email;
    const body = await templateEngine.loadTemplate('test', ["Armaan Gupta"])

    postage.sendEmail({
        from: 'hi@portal.kreativemail.com',
        replyTo: 'armaan@kreative.im',
        to: emailAddress,
        subject: 'Join the Federation',
        body: body
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