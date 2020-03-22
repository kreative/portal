const generateKSN = require("../utils/GenerateKSN");
const generateKeychain = require("../utils/GenerateKeychain");
const Account = require("../models/AccountModel");
const bcrypt = require("bcryptjs");

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
        .then(account => {
            generateKeychain(account.ksn, aidn)
            .then(key => res.json({status: 202, data: key}))
            .catch(error => res.json({status: 505, data: error}));
        })
        .catch(error => res.json({status: 505, data: error}));
    });
};



exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const aidn = req.body.AIDN;

    Account.findOne({where: {username}})
    .then(account => {
        if (account === null) res.json({status: 404});
        else {
            bcrypt.compare(password, account.bpassword)
            .then(result => {
                if (result) {
                    generateKeychain(account.ksn, aidn)
                    .then(key => res.json({status: 202, data: key}))
                    .catch(error => res.json({status: 505, data: error}));
                }
                else res.json({status: 406});
            })
            .catch(error => res.json({status: 505, data: error}));
        }
    });
};


// this method will be used by the client to verify that the username is unique
// before sending over all the data to the signup method
exports.checkUsername = (req, res) => {};

// this method will be used by the client to verify that the email is unique
// and that the account doesn't exist
// before sending over all the data to the signup method
exports.checkEmail = (req, res) => {};