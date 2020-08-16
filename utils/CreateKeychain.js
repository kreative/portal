const nanoidGenerate = require('nanoid/generate');
const jwt = require("jsonwebtoken");
const generate = require("../utils/Generate");
const Keychain = require("../components/accounts/keychain.model");

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

const createKeychain = (ksn, aidn) => {
    const time = Date.now();
    const secureHash = nanoidGenerate("1234567890", 12);
    const key = jwt.sign({ksn, aidn, secureHash, time}, SECRET);
    const expired = false;
    const createdat = Date.now();
    const d = new Date();
    const e = d.setDate(d.getDate() + 30)
    const expire_by = e.getTime();

    return new Promise((resolve, reject) => {
        generate.ccn(ccn => {
            Keychain.create({
                ccn,
                ksn,
                aidn,
                key,
                expired,
                expire_by,
                createdat
            })
                .then(keychain => resolve(keychain.key))
                .catch(error => reject(error));
        });
    });
};

module.exports = createKeychain;