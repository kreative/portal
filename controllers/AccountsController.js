const bcrypt = require("bcryptjs");
const Account = require("../models/AccountModel");
const Keychain = require("../models/KeychainModel");
const ResetCode = require("../models/ResetCodeModel");
const generateKSN = require("../utils/GenerateKSN");
const convertUsernameToKSN = require("../utils/ConvertUsernameToKsn");
const generateKeychain = require("../utils/GenerateKeychain");
const createResetCode = require("../utils/CreateResetCode");
const postage = require("../utils/PostageUtils");
const signal = require("../utils/SignalUtils");
const verifyKey = require("../utils/VerifyKey");

exports.getLoginPage = (req, res) => {
    const appNameRaw = req.query.appname;

    if (appNameRaw === undefined) {
        // log to iris
        res.redirect("/404");
    }

    const appName = appNameRaw.replace("+", " ");

    res.render('login', {appName});
};


exports.getSignupPage = (req, res) => {
    const appNameRaw = req.query.appname;
    
    if (appNameRaw === undefined) {
        // log to iris
        res.redirect("/404");
    }

    const appName = appNameRaw.replace("+", " ");

    res.render('signup', {appName});
};


exports.getRequestResetPasswordPage = (req, res) => {

};


exports.getResetPasswordPage = (req, res) => {

};


exports.getFindUsernamePage = (req, res) => {

};


exports.verifyKey = (req, res) => {
    const key = req.body.key;
    const ksn = req.body.ksn;
    const aidn = req.body.aidn;

    verifyKey(key, ksn, aidn)
    .then(info => {
        const ccn = info.ccn;

        res.json({status:202, data:{ccn,ksn,aidn}});
    })
    .catch(err => {
        const status = err.status;
        const errorCode = err.code;

        res.json({status, data:{errorCode}});
    })
};


exports.signup = (req, res) => {
    const username = req.body.username;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const phone_country_code = req.body.phone_country_code;
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
            phone_number,
            phone_country_code,
            bpassword,
            createdat
        })
        .catch(err => {
            console.log(err)
            if (err.name === "SequelizeUniqueConstraintError") {
                res.json({status: 500, data: {errorCode: "email_or_phone_inuse"}});
            }
            else {
                res.json({status: 500, data: err});
            }
        })
        .then(account => {
            generateKeychain(account.ksn, aidn)
            .catch(err => res.json({status: 500, data: err}))
            .then(key => {
                try {
                    postage.sendWelcomeEmail(account.fname, account.email);
                }
                finally {
                    res.json({status: 202, data: {key}});
                }
            });
        });
    });
};


exports.verifyEmail = (req, res) => {};


exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const aidn = req.body.AIDN;

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) res.json({status: 404});
        else {
            bcrypt.compare(password, account.bpassword)
            .catch(err => res.json({status: 500, data: err}))
            .then(result => {
                console.log(result)
                if (result) {
                    generateKeychain(account.ksn, aidn)
                    .catch(err => res.json({status: 500, data: err}))
                    .then(key => {
                        try {
                            postage.sendLoginNotificationEmail(account.fname, account.email, {});
                        }
                        finally {
                            res.json({status: 202, data: {key}});
                        }
                    });
                }
                else res.json({status: 406});
            });
        }
    });
};


exports.logout = (req, res) => {
    const ccn = res.locals.ccn;

    Keychain.update({expired: true},{where: {ccn}})
    .catch(err => res.json({status: 500}))
    .then(update => res.json({status: 202}));
};


exports.requestPasswordResetCode = (req, res) => {
    const username = req.body.username;
    const deliveryType = req.body.delivery_type;

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) {
            res.json({status: 404, data: {errorCode: "no_account_found"}});
        }
        else {
            const phone = account.phone_number;
            const cc = account.phone_country_code;

            createResetCode(account.ksn)
            .catch(err => {
                res.json({status: 500, data: {errorCode: "internal_server_error"}})
            })
            .then(resetCode => {
                if (!["email", "sms"].includes(deliveryType)) {
                    res.json({status: 404, data: {errorCode: "delivery_type_invalid"}});
                }
                else {
                    try {
                        if (deliveryType === "email") {
                            postage.sendResetCode(account.email, resetCode, account.fname);
                        }
                        else if (deliveryType === "sms") {
                            const tel = `+${cc.toString()}${phone.toString()}`;
                            signal.sendResetCode(tel, resetCode, account.fname);
                        }
                    }
                    catch(err) {
                        res.json({status: 500, data: {errorCode: "internal_server_error", error: err}});
                    }
                    finally {
                        const strPhone = phone.toString();
                        const lastFourDigits = strPhone.slice(6, 10);
                        res.json({status: 202, data: {email: account.email, tel: lastFourDigits}});
                    }
                }
            });
        }
    });
};


exports.verifyResetCode = (req, res) => {
    const code = req.body.reset_code;
    const username = req.body.username;

    ResetCode.findOne({where: {code}})
    .then(resetCode => {
        if (resetCode === null) {
            res.json({status: 404, data: {errorCode: "reset_code_not_found"}});
        }
        else {
            convertUsernameToKSN(username)
            .catch(err => res.json({status: 500, data: {errorCode: err.errorCode}}))
            .then(ksn => {
                if (ksn === resetCode.ksn) {
                    ResetCode.destroy({where: {code}})
                    .then(() => res.json({status: 202, data: {ksn}}));
                }
                else {
                    res.json({status: 401, data: {errorCode: "invalid_reset_code"}});
                }
            });
        }
    });
};


// this method has to be secured
// only the portal frontend can call this method, no outside source
// that too, only after the reset code is verified
exports.resetPassword = (req, res) => {
    const newPassword = req.body.new_password;
    const ksn = req.headers['portal_ksn'];

    const salt = bcrypt.genSaltSync(12);
    const bpassword = bcrypt.hashSync(newPassword, salt);

    Account.findOne({where: {ksn}})
    .catch(err => {
        //log errror
        res.json({status: 500, data: {errorCode: "internal_server_error"}});
    })
    .then(account => {
        if (account === null) {
            //log erro
            res.json({status: 404, data: {errorCode: "account_not_found"}});
        }
        else {
            Account.update({bpassword}, {where: {ksn}})
            .catch(err => {
                //log error
                res.json({status: 500, data: {erroCode: "internal_server_error"}});
            })
            .then(update => {
                try {
                    postage.sendPasswordResetNotification(account.email, account.fname);
                }
                finally {
                    res.json({status: 202});
                }
            })
        }
    });
};


exports.checkIfCredExists = (req, res) => {
    const type = req.body.type;
    const cred = req.body.cred;

    if (type === "username") {
        Account.findOne({where:{username:cred}})
        .then(account => {
            if (account === null) res.json({status:202, data:{exists:false}});
            else res.json({status:202, data:{exists:true,fname:account.fname}});
        });
    }
    else if (type === "email") {
        Account.findOne({where:{email:cred}})
        .then(account => {
            if (account === null) res.json({status:202, data:{exists:false}});
            else res.json({status:202, data:{exists:true}});
        });
    }
    else if (type === "phone") {
        Account.findOne({where:{phone_number:cred}})
        .then(account => {
            if (account === null) res.json({status:202, data:{exists:false}});
            else res.json({status:202, data:{exists:true}});
        });
    }
    else {

    }
};