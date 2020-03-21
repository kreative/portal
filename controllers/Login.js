const Account = require("../models/AccountModel");
const generateKeychain = require("../utils/GenerateKeychain");
const bcrypt = require("bcryptjs");

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
                    .then((key) => {
                        
                    })
                    .catch((err) => {

                    });
                }
                else res.json({status: 406});
            });
        }
    });
};