const bcrypt = require("bcryptjs");
const Account = require("../models/AccountModel");
const Keychain = require("../models/KeychainModel");
const generateKSN = require("../utils/GenerateKSN");
const generateKeychain = require("../utils/GenerateKeychain");
const createResetToken = require("../utils/CreateResetToken");
const postage = require("../utils/PostageUtils");

exports.getLoginPage = (req, res) => {
    const appchain = req.query.appchain;
};


exports.getSignupPage = (req, res) => {

};


exports.getRequestResetPasswordPage = (req, res) => {

};


exports.getResetPasswordPage = (req, res) => {

};


// this is going to essentially be what get's sent back if
// the key is valid, as the verifyKey middleware will run
// before this controller is run
exports.verify = (req, res) => res.status(202).json({status: 202});


exports.signup = (req, res) => {
    const username = req.body.username;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const createdat = Date.now();
    const aidn = req.body.AIDN;

    const salt = bcrypt.genSaltSync(12);
    const bpassword = bcrypt.hashSync(password, salt);

    generateKSN(ksn => {
        Account.create({
            ksn,
            username,
            fname,
            lname,
            email,
            bpassword,
            createdat
        })
        .catch(err => {
            console.log(err)
            if (err.name === "SequelizeUniqueConstraintError") {
                res.status(500).json({status: 500, data: {errorCode: "email_inuse"}});
            }
            else {
                res.status(500).json({status: 500, data: err});
            }
        })
        .then(account => {
            generateKeychain(account.ksn, aidn)
            .catch(err => res.status(500).json({status: 500, data: err}))
            .then(key => {
                try {
                    postage.sendWelcomeEmail(account.fname, account.email);
                }
                finally {
                    res.status(202).json({status: 202, data: key});
                }
            });
        });
    });
};


exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const aidn = req.body.AIDN;

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) res.status(404).json({status: 404});
        else {
            bcrypt.compare(password, account.bpassword)
            .catch(err => res.status(500).json({status: 500, data: err}))
            .then(result => {
                if (result) {
                    generateKeychain(account.ksn, aidn)
                    .catch(err => res.status(500).json({status: 500, data: err}))
                    .then(key => {
                        try {
                            postage.sendLoginNotificationEmail(account.fname, account.email, {});
                        }
                        finally {
                            res.status(202).json({status: 202, data: key});
                        }
                    });
                }
                else res.status(406).json({status: 406});
            });
        }
    });
};


exports.logout = (req, res) => {
    const ccn = res.locals.ccn;

    Keychain.update({expired: true},{where: {ccn}})
    .catch(err => res.status(500).json({status: 500}))
    .then(update => res.status(202).json({status: 202}));
};


exports.requestPasswordResetUsername = (req, res) => {
    const username = req.body.cred;

    Account.findOne({where: {username}})
    .then(account => {
        console.log(account)
        if (account === null) {
            res.json({status: 404, data: "internal_server_error"});
        }
        else {
            createResetToken(account.ksn)
            .catch(err => res.status(500).json({status: 500, data: {errorCode: "internal_sever_error", error: err}}))
            .then(resetToken => {
                try {
                    postage.sendPasswordResetEmail(userEmail, resetToken, userFname);
                }
                catch(err) {
                    res.status(500).json({status: 500, data: {errorCode: "internal_server_error", error: err}});
                }
                finally {
                    res.status(202).json({status: 202, data: {email: userEmail}});
                }
            });
        }
    });
};

exports.requestPasswordResetEmail = (req, res) => {
    Account.findOne({where: {email: req.body.cred}})
    .then(account => {
        if (account === null) {
            res.json({status: 404, data: "internal_server_error"});
        }
        else {
            createResetToken(account.ksn)
            .catch(err => res.status(500).json({status: 500, data: {errorCode: "internal_sever_error", error: err}}))
            .then(resetToken => {
                try {
                    postage.sendPasswordResetEmail(userEmail, resetToken, userFname);
                }
                catch(err) {
                    res.status(500).json({status: 500, data: {errorCode: "internal_server_error", error: err}});
                }
                finally {
                    res.status(202).json({status: 202, data: {email: userEmail}});
                }
            });
        }
    });
};


exports.resetPassword = (req, res) => {

};

// this method will be used by the client to verify that the username is unique
// before sending over all the data to the signup method
exports.checkUsername = (req, res) => {};

// this method will be used by the client to verify that the email is unique
// and that the account doesn't exist
// before sending over all the data to the signup method
exports.checkEmail = (req, res) => {};