const Keychain = require('../components/accounts/keychain.model');
const jwt = require('jsonwebtoken');

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

const verifyKey = (key, ksn, aidn) => {
    return new Promise((resolve, reject) => {
        jwt.verify(key, SECRET, (err, payload) => {
            if (err) reject({status:401, code:"invalid_key"});
            if (payload.ksn !== ksn) reject({status:401, code:"ksn_mismatch"});
            if (payload.aidn !== aidn) reject({status:401, code:"aidn_mismatch"});

            Keychain.findOne({where: {key}})
                .catch(err => {
                    reject({status:500, code:"internal_server_error"});
                })
                .then(keychain => {
                    if (keychain.expired || ((Date.now() - keychain.expire_by)/1000/60 > 0)) {
                        reject({status:401, code:"expired_keychain"});
                    }
                    else {
                        const ccn = keychain.ccn;
                        resolve({ksn, ccn});
                    }
                });
        });
    });
};

module.exports = verifyKey;