const bcrypt = require("bcryptjs");
const Account = require("./account.model");
const Keychain = require("./keychain.model");
const ResetCode = require("./resetcode.model");
const generate = require("../../utils/Generate");
const convertUsernameToKSN = require("../../utils/ConvertUsernameToKsn");
const createKeychain = require("../../utils/CreateKeychain");
const createResetCode = require("../../utils/CreateResetCode");
const postage = require("../../lib/postage/postage.utils");
const verifyKey = require("../../utils/VerifyKey");
const ev = require("../../utils/EmailVerificationKit");


exports.getLoginPage = (req, res) => {
    res.render('login', {appName: res.locals.appName});
};


exports.getSignupPage = (req, res) => {
    res.render('signup', {appName: res.locals.appName});
};


exports.getResetPasswordPage = (req, res) => {
    res.render('resetPassword', {appName: res.locals.appName});
};


exports.getFindUsernamePage = (req, res) => {
    res.render('findUsername', {appName: res.locals.appName});
};

exports.getVerifyEmailPage = (req, res) => {
    res.render('verifyEmail');
};


// method for external applications to verify a key
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
    });
};


exports.signup = (req, res) => {
    const username = req.body.username;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const phone_country_code = req.body.phone_country_code;
    const password = req.body.password;
    const email_verified = false;
    const createdat = Date.now();
    const aidn = req.body.AIDN;
    const salt = bcrypt.genSaltSync(12);
    const bpassword = bcrypt.hashSync(password, salt);

    generate.ksn(ksn => {
        Account.create({
            ksn,
            username,
            fname,
            lname,
            email,
            phone_number,
            phone_country_code,
            bpassword,
            email_verified,
            createdat
        })
        .catch(err => {
            console.log(err)
            if (err.name === "SequelizeUniqueConstraintError") {
                res.json({status: 401, data: {errorCode: "email_or_phone_inuse"}});
            }
            else {
                res.json({status: 500, data: err});
            }
        })
        .then(account => {
            createKeychain(account.ksn, aidn)
            .catch(err => {
                res.json({status: 500, data: err})
            })
            .then(key => {
                try {
                    postage.sendWelcomeEmail(account.fname, account.email);
                    ev.createUrl(account.ksn, (url) => {
                        postage.sendEmailVerificationEmail(account.email, url);
                    });
                }
                catch (err) {
                    console.log(err);
                }
                finally {
                    res.json({status: 202, data: {key}});
                }
            });
        });
    });
};


exports.verifyEmail = (req, res) => {
    const token = req.body.token;

    ev.verifyToken(token)
    .catch(err => {
        res.json({status:401, data:{errorCode:"invalid_token"}});
    })
    .then((ksn) => {
        Account.update({verified_email:true}, {where:{ksn}})
        .catch(err => {
            res.json({status:500, data:{errorCode:"internal_server_error"}});
        })
        .then(update => {
            res.json({status:202});
        });
    });
};


exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const aidn = req.body.AIDN;

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) {
            res.json({status: 404, data:{errorCode:"no_account_found"}});
        }
        else {
            bcrypt.compare(password, account.bpassword)
            .catch(err => {
                res.json({status: 500, data: err});
            })
            .then(result => {
                if (result) {
                    createKeychain(account.ksn, aidn)
                    .catch(err => {
                        res.json({status: 500, data: err});
                    })
                    .then(key => {
                        try {
                            postage.sendLoginNotificationEmail(account.fname, account.email, {});
                        }
                        catch (err) {
                            console.log(err);
                        }
                        finally {
                            res.json({status: 202, data: {key}});
                        }
                    });
                }
                else {
                    res.json({status: 406, data:{errorCode:"incorrect_password"}});
                }
            });
        }
    });
};


exports.updateAccount = (req, res) => {
    const ksn = req.body.ksn;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const profile_picture = req.body.profile_picture;

    Account.update({
        fname,
        lname,
        username,
        profile_picture,
    }, {where:ksn})
    .catch(err => {
        console.log(err);
         res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        res.json({status:200});
    });
};


exports.updateAccountEmail = (req, res) => {
    const ksn = req.body.ksn;
    const email = req.body.email;
    const email_verified = false;

    Account.update({email,email_verified}, {where:{ksn}})
    .catch(err => {
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        try {
            ev.createUrl(account.ksn, (url) => {
                postage.sendEmailVerificationEmail(account.email, url);
            });
        }
        catch (err) {
            console.log(err);
        }
        finally {
            res.json({status:202});
        }
    })
};


exports.logout = (req, res) => {
    const ccn = res.locals.ccn;

    Keychain.update({expired: true},{where: {ccn}})
    .catch(err => {
        console.log(err);
        res.json({status: 500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        res.json({status: 202});
    });
};


exports.requestPasswordResetCode = (req, res) => {
    const username = req.body.username;
    const deliveryType = req.body.delivery_type;

    Account.findOne({where: {username}})
    .then(account => {
        const ksn = account.ksn;
        if (account === null) {
            res.json({status: 404, data: {errorCode: "no_account_found"}});
        }
        else {
            createResetCode(account.ksn)
            .catch(err => {
                console.log(err);
                res.json({status: 500, data: {errorCode: "internal_server_error"}})
            })
            .then(resetCode => {
                if (!["email"].includes(deliveryType)) {
                    res.json({status: 404, data: {errorCode: "delivery_type_invalid"}});
                }
                else {
                    try {
                        postage.sendResetCode(account.email, resetCode, account.fname);
                    }
                    catch(err) {
                        console.log(err);
                        res.json({status: 500, data: {errorCode: "internal_server_error", error: err}});
                    }
                    finally {
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

    ResetCode.findOne({where: {code}})
    .then(resetCode => {
        if (resetCode === null) {
            res.json({status: 404, data: {errorCode: "reset_code_not_found"}});
        }
        else {
            convertUsernameToKSN(username)
            .catch(err => {
                console.log(err);
                res.json({status: 500, data: {errorCode: err.errorCode}})
            })
            .then(ksn => {
                if (ksn === resetCode.ksn) {
                    ResetCode.destroy({where: {code}})
                    .catch(err => {
                        console.log(err);
                        res.json({status:500, data:{errorCode:"internal_server_error"}});
                    })
                    .then(() => {
                        res.json({status: 202, data: {ksn}});
                    });
                }
                else {
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

    Account.findOne({where: {ksn}})
    .catch(err => {
        console.log(err);
        res.json({status: 500, data: {errorCode: "internal_server_error"}});
    })
    .then(account => {
        if (account === null) {
            res.json({status: 404, data: {errorCode: "account_not_found"}});
        }
        else {
            Account.update({bpassword}, {where: {ksn}})
            .catch(err => {
                console.log(err);
                res.json({status: 500, data: {errorCode: "internal_server_error"}});
            })
            .then(update => {
                try {
                    postage.sendPasswordResetNotification(account.email, account.fname);
                }
                catch (err) {
                    console.log(err);
                }
                finally {
                    res.json({status: 202});
                }
            });
        }
    });
};


exports.checkIfCredExists = (req, res) => {
    const type = req.body.type;
    const cred = req.body.cred;

    if (type === "username") {
        Account.findOne({where:{username:cred}})
        .then(account => {
            if (account === null) {
                res.json({status:202, data:{exists:false}});
            }
            else {
                res.json({status:202, data:{exists:true,fname:account.fname}});
            }
        });
    }
    else if (type === "email") {
        Account.findOne({where:{email:cred}})
        .then(account => {
            if (account === null) {
                res.json({status:202, data:{exists:false}});
            }
            else {
                res.json({status:202, data:{exists:true}});
            }
        });
    }
    else if (type === "phone") {
        Account.findOne({where:{phone_number:cred}})
        .then(account => {
            if (account === null) {
                res.json({status:202, data:{exists:false}});
            }
            else {
                res.json({status:202, data:{exists:true}});
            }
        });
    }
    else {

    }
};


exports.convertEmailToUsername = (req, res) => {
    const email = req.body.email;

    Account.findOne({where:{email}})
    .then(account => {
        if (account === null) {
            res.json({status:404, data:{errorCode:"account_not_found"}});
        }
        else {
            const username = account.username;
            const fname = account.fname;
            res.json({status:202, data:{username, fname}});
        }
    });
};