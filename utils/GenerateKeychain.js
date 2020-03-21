const generate = require('nanoid/generate');
const generateCCN = require("../utils/GenerateCCN");
const Keychain = require("../models/Keychain");
const jwt = require("jsonwebtoken");

const SECRET = process.env.KEYCHAIN_SECURITY_CODE;

exports.generateKey = (ksn, aidn) => {
    const time = Date.now();
    const secureHash = generate("1234567890", 12);
    const key = jwt.sign({ksn, aidn, secureHash, time}, SECRET);
    const expired = false;
    const createdat = Date.now();

    generateCCN(ccn => {
        Keychain.create({
            ccn,
            ksn,
            aidn,
            key,
            expired,
            createdat
        })
        .then(keychain => {
            return new Promise((resolve, reject) => {
                resolve(keychain.key);
            });
        });
    });
};