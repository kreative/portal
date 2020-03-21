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
        .then(account => res.json({status: 202}));
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
                }
                else res.json({status: 406});
            });
        }
    });
};

exports.checkUsername = (req, res) => {};