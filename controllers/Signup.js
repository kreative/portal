const generateKSN = require("../utils/CreateKSN");
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
        .then(account => {
            res.json({
                status: 202,
                data: {
                    username: account.username,
                    fname: account.fname,
                    lname: account.lname,
                    email: account.email
                }
            });
        });
    });
};