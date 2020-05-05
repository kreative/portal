const generate = require('nanoid/generate');
const jwt = require("jsonwebtoken");

const rawSecret = process.env.KEYCHAIN_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

exports.createUrl = (ksn, callback) => {
    const time = Date.now();
    const secureHash = generate("abcdefg1234567890", 12);
    const token = jwt.sign({ksn, secureHash, time}, SECRET);

    callback(`https://portal.kreative.im/verifyemail?token=${token}`);
};

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) reject("invalid_token");
            else resolve(payload.ksn);
        })
    });
};