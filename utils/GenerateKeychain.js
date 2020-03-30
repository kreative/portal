const generate = require('nanoid/generate');
const generateCCN = require("../utils/GenerateCCN");
const Keychain = require("../models/KeychainModel");
const jwt = require("jsonwebtoken");

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = new Buffer(rawSecret, 'base64');

const generateKeychain = (ksn, aidn) => {
    const time = Date.now();
    const secureHash = generate("1234567890", 12);
    const key = jwt.sign({ksn, aidn, secureHash, time}, SECRET);
    const expired = false;
    const createdat = Date.now();

    return new Promise((resolve, reject) => {
        generateCCN(ccn => {
            Keychain.create({
                ccn,
                ksn,
                aidn,
                key,
                expired,
                createdat
            })
            .then(keychain => resolve(keychain.key))
            .catch(error => reject(error));
        });
    });
};

module.exports = generateKeychain;