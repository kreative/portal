const Keychain = require('../models/KeychainModel');
const jwt = require('jsonwebtoken');
const IRIS = require("../config/iris");

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

const verifyKey = (key, ksn, aidn) => {
    return new Promise((resolve, reject) => {
        jwt.verify(key, SECRET, (err, payload) => {
            if (err) {
                IRIS.info("key invalid",{ksn,aidn,key},["api"]);
                reject({status:401, code:"invalid_key"});
            }

            if (payload.ksn !== ksn) {
                IRIS.info("ksn mismatch",{ksn,aidn,key},["api"]);
                reject({status:401, code:"ksn_mismatch"});
            }

            if (payload.aidn !== aidn) {
                IRIS.info("aidn mismatch",{ksn,aidn,key},["api"]);
                reject({status:401, code:"aidn_mismatch"});
            }

            Keychain.findOne({where: {key}})
            .catch(err => {
                IRIS.critical("Keychain.findOne failed",{key,err},["api","ise"]);
                reject({status:500, code:"internal_server_error"});
            })
            .then(keychain => {
                if (keychain.expired) {
                    IRIS.info("keychain was expired",{key},["api"]);
                    reject({status:401, code:"expired_keychain"});
                }
                
                const ccn = keychain.ccn;

                resolve({ksn, ccn});
            });
        });
    });
};

module.exports = verifyKey;