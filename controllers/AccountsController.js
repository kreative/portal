const bcrypt = require("bcryptjs");
const Account = require("../models/AccountModel");
const Keychain = require("../models/KeychainModel");
const ResetCode = require("../models/ResetCodeModel");
const generateKSN = require("../utils/GenerateKSN");
const convertUsernameToKSN = require("../utils/ConvertUsernameToKsn");
const generateKeychain = require("../utils/GenerateKeychain");
const createResetCode = require("../utils/CreateResetCode");
const postage = require("../utils/PostageUtils");
const verifyKey = require("../utils/VerifyKey");
const IRIS = require("../config/iris");


exports.getLoginPage = (req, res) => {
    IRIS.info("user routed to login page",{url: req.originalUrl},["ui"]);
    res.render('login', {appName: res.locals.appName});
};


exports.getSignupPage = (req, res) => {
    IRIS.info("user routed to signup page",{url: req.originalUrl},["ui"]);
    res.render('signup', {appName: res.locals.appName});
};


exports.getResetPasswordPage = (req, res) => {
    IRIS.info("user routed to reset page",{url: req.originalUrl},["ui"]);
    res.render('resetPassword', {appName: res.locals.appName});
};


exports.getFindUsernamePage = (req, res) => {
    IRIS.info("user routed to find username page",{url: req.originalUrl},["ui"]);
    res.render('findUsername', {appName: res.locals.appName});
};


// method for external applications to verify a key
exports.verifyKey = (req, res) => {
    const key = req.body.key;
    const ksn = req.body.ksn;
    const aidn = req.body.aidn;

    IRIS.info("key verification started",{key,ksn,aidn},["api"]);

    verifyKey(key, ksn, aidn)
    .then(info => {
        const ccn = info.ccn;

        IRIS.info("key verified",{ccn},["api","success"]);
        res.json({status:202, data:{ccn,ksn,aidn}});
    })
    .catch(err => {
        const status = err.status;
        const errorCode = err.code;

        IRIS.info("failed to verify key",{status, errorCode},["api"]);
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

    IRIS.info("signup started",{aidn,email,username},["api"]);

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
                IRIS.info("signup failed",{errorCode: "email_or_phone_inuse"},["api"]);
                res.json({status: 401, data: {errorCode: "email_or_phone_inuse"}});
            }
            else {
                IRIS.critical("ISE during signup",{err},["api","catch"]);
                res.json({status: 500, data: err});
            }
        })
        .then(account => {
            generateKeychain(account.ksn, aidn)
            .catch(err => {
                IRIS.critical("signup: generate keychain failed",{err},["api","catch","ise"]);
                res.json({status: 500, data: err})
            })
            .then(key => {
                try {
                    postage.sendWelcomeEmail(account.fname, account.email);
                }
                catch (err) {
                    IRIS.error("sending welcome email failed", {err}, ["api","catch","ise"]);
                }
                finally {
                    IRIS.info("account created",{ksn:account.ksn},["api","success"]);
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

    IRIS.info("login initiated",{username,aidn},["api"]);

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) {
            IRIS.info("account not found",{username},["api"]);
            res.json({status: 404, data:{errorCode:"no_account_found"}});
        }
        else {
            bcrypt.compare(password, account.bpassword)
            .catch(err => {
                IRIS.critical("bcrypt.compare failed",{err},["api","ise"]);
                res.json({status: 500, data: err});
            })
            .then(result => {
                if (result) {
                    generateKeychain(account.ksn, aidn)
                    .catch(err => {
                        IRIS.critical("login: keychain generation failed",{err},["api","ise"]);
                        res.json({status: 500, data: err});
                    })
                    .then(key => {
                        try {
                            postage.sendLoginNotificationEmail(account.fname, account.email, {});
                        }
                        catch (err) {
                            IRIS.error("login notification email failed to send",{ksn:account.ksn},["api","catch"]);
                        }
                        finally {
                            IRIS.info("login succeeded",{ksn:account.ksn},["api","success"]);
                            res.json({status: 202, data: {key}});
                        }
                    });
                }
                else {
                    IRIS.info("user entered incorrect password",{ksn:account.ksn},["api","caught"]);
                    res.json({status: 406, data:{errorCode:"incorrect_password"}});
                }
            });
        }
    });
};


exports.logout = (req, res) => {
    const ccn = res.locals.ccn;

    IRIS.info("logout started",{ccn},["api"]);

    Keychain.update({expired: true},{where: {ccn}})
    .catch(err => {
        IRIS.critical("logging user out failed",{err},["api","ise"]);
        res.json({status: 500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        IRIS.info("user logged out",{update},["api","success"]);
        res.json({status: 202});
    });
};


exports.requestPasswordResetCode = (req, res) => {
    const username = req.body.username;
    const deliveryType = req.body.delivery_type;

    IRIS.info("requesting password reset code",{username},["api"]);

    Account.findOne({where: {username}})
    .then(account => {
        const ksn = account.ksn;

        if (account === null) {
            IRIS.warn("no account found when requesting for password reset code",{username},["api"]);
            res.json({status: 404, data: {errorCode: "no_account_found"}});
        }
        else {
            createResetCode(account.ksn)
            .catch(err => {
                IRIS.critical("creating reset code failed",{err,ksn},["api","ise"]);
                res.json({status: 500, data: {errorCode: "internal_server_error"}})
            })
            .then(resetCode => {
                if (!["email"].includes(deliveryType)) {
                    IRIS.warn("incorrect delivery type provided",{deliveryType,ksn},["api"]);
                    res.json({status: 404, data: {errorCode: "delivery_type_invalid"}});
                }
                else {
                    try {
                        postage.sendResetCode(account.email, resetCode, account.fname);
                    }
                    catch(err) {
                        IRIS.critical("reset code failed to send",{err,ksn},["api","catch"]);
                        res.json({status: 500, data: {errorCode: "internal_server_error", error: err}});
                    }
                    finally {
                        IRIS.info("reset code sent perfectly",{ksn},["api","success"]);
                        res.json({status: 202, data: {email: account.email}});
                    }
                }
            });
        }
    });
};


exports.verifyResetCode = (req, res) => {
    const code = req.body.reset_code;
    const username = req.body.username;

    IRIS.info("verifying reset code started",{username},["api"]);

    ResetCode.findOne({where: {code}})
    .then(resetCode => {
        if (resetCode === null) {
            IRIS.info("reset code was not found",{resetCode,username},["api"]);
            res.json({status: 404, data: {errorCode: "reset_code_not_found"}});
        }
        else {
            convertUsernameToKSN(username)
            .catch(err => {
                IRIS.critical("convert ksn to username failed",{username},["api","catch"]);
                res.json({status: 500, data: {errorCode: err.errorCode}})
            })
            .then(ksn => {
                if (ksn === resetCode.ksn) {
                    ResetCode.destroy({where: {code}})
                    .catch(err => {
                        IRIS.warn("destroy reset code failed",{code,username,ksn},["api","catch"]);
                        res.json({status:500, data:{errorCode:"internal_server_error"}});
                    })
                    .then(() => {
                        IRIS.info("reset code destroyed and verifyResetCode passed",{ksn},["api","success"]);
                        res.json({status: 202, data: {ksn}});
                    });
                }
                else {
                    IRIS.info("reset code was invalid",{code,ksn},["api","else"]);
                    res.json({status: 401, data: {errorCode: "invalid_reset_code"}});
                }
            });
        }
    });
};


exports.resetPassword = (req, res) => {
    const newPassword = req.body.new_password;
    const salt = bcrypt.genSaltSync(12);
    const bpassword = bcrypt.hashSync(newPassword, salt);
    const ksn = req.body.ksn;

    IRIS.info("reset password started",{ksn},["api"]);

    Account.findOne({where: {ksn}})
    .catch(err => {
        IRIS.critical("Account.findOne failed",{ksn,err},["api","ise","catch"]);
        res.json({status: 500, data: {errorCode: "internal_server_error"}});
    })
    .then(account => {
        if (account === null) {
            IRIS.warn("no account found though there should be",{ksn},["api"]);
            res.json({status: 404, data: {errorCode: "account_not_found"}});
        }
        else {
            Account.update({bpassword}, {where: {ksn}})
            .catch(err => {
                IRIS.critical("updating password failed",{ksn},["api","catch"]);
                res.json({status: 500, data: {errorCode: "internal_server_error"}});
            })
            .then(update => {
                try {
                    postage.sendPasswordResetNotification(account.email, account.fname);
                }
                catch (err) {
                    IRIS.error("send password reset notification failed",{email:account.email,ksn},["api"]);
                }
                finally {
                    IRIS.info("reset password went perfectly",{update},["api","success"]);
                    res.json({status: 202});
                }
            })
        }
    });
};


exports.checkIfCredExists = (req, res) => {
    const type = req.body.type;
    const cred = req.body.cred;

    IRIS.info("check if credential exist starting",{type,cred},["api"]);

    if (type === "username") {
        Account.findOne({where:{username:cred}})
        .then(account => {
            if (account === null) {
                IRIS.info("credential unexist",{cred,type},["api"]);
                res.json({status:202, data:{exists:false}});
            }
            else {
                IRIS.info("credential exists",{ksn:account.ksn},["api","success"]);
                res.json({status:202, data:{exists:true,fname:account.fname}});
            }
        });
    }
    else if (type === "email") {
        Account.findOne({where:{email:cred}})
        .then(account => {
            if (account === null) {
                IRIS.info("credential unexist",{cred,type},["api"]);
                res.json({status:202, data:{exists:false}});
            }
            else {
                IRIS.info("credential exists",{ksn:account.ksn},["api","success"]);
                res.json({status:202, data:{exists:true}});
            }
        });
    }
    else if (type === "phone") {
        Account.findOne({where:{phone_number:cred}})
        .then(account => {
            if (account === null) {
                IRIS.info("credential unexist",{cred,type},["api"]);
                res.json({status:202, data:{exists:false}});
            }
            else {
                IRIS.info("credential exists",{ksn:account.ksn},["api","success"]);
                res.json({status:202, data:{exists:true}});
            }
        });
    }
    else {

    }
};


exports.convertEmailToUsername = (req, res) => {
    const email = req.body.email;

    IRIS.info("convert email to username starting",{email},["api"]);

    Account.findOne({where:{email}})
    .then(account => {
        if (account === null) {
            IRIS.info("no account found",{email},["api"]);
            res.json({status:404, data:{errorCode:"account_not_found"}});
        }
        else {
            const username = account.username;
            const fname = account.fname;

            IRIS.info("email converting perfectly",{username,fname},["api","sucess"]);
            res.json({status:202, data:{username, fname}});
        }
    });
};