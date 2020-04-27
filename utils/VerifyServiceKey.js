const jwt = require("jsonwebtoken");

const rawSecret = process.env.SERVICEKEY_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

const verifyServiceKey = (service_key, recieving_aidn, calling_aidn) => {
    return new Promise((resolve, reject) => {
        jwt.verify(service_key, SECRET, (err, payload) => {
            if (err) reject("invalid_service_key");
            else if (payload.recieving_aidn !== recieving_aidn) reject("recieving_aidn_mismatch");
            else if (payload.calling_aidn !== calling_aidn) reject("calling_aidn_mismatch");
            else resolve();
        });
    });
};

module.exports = verifyServiceKey;