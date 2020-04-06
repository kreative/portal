const Keychain = require('../models/KeychainModel');
const jwt = require('jsonwebtoken');

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

const verifyKey = (req, res, next) => {
    const key = req.headers['key'];

    const ksn = req.body.ksn;
    const aidn = req.body.aidn;

    jwt.verify(key, SECRET, (err, payload) => {
        if (err) {
            res.status(401).json({status: 401, data: {errorCode: "invalid_key"}});
        }
        if (payload.ksn !== ksn) {
            res.status(401).json({status: 401, data: {errorCode: "invalid_ksn"}})
        }
        if (payload.aidn !== aidn) {
            res.status(401).json({status: 401, data: {errorCode: "invalid_aidn"}});
        }
        Keychain.findOne({where: {key}})
        .then(keychain => {
            if (keychain.expired) {
                res.status(401).json({status: 401, data: {errorCode: "keychain_expired"}});
            }
            res.locals.ccn = keychain.ccn;
            res.locals.ksn = keychain.ksn;
            next();
        })
        .catch(err => res.status(500).json({status: 500, data: err}));
    });
};

module.exports = verifyKey;