const verifyKey = require("../utils/VerifyKey");

const verifyKeyMiddleware = (req, res, next) => {
    const key = req.headers['portal_key'];
    const ksn = req.headers['portal_ksn'];
    const aidn = req.headers['portal_aidn'];

    verifyKey(key, ksn, aidn)
    .catch(err => {
        const status = err.status;
        const errorCode = err.code;

        res.status(status).json({status, data:{errorCode}});
    })
    .then(info => {
        res.locals.ksn = info.ksn;
        res.locals.ccn = info.ccn;
        res.locals.aidn = info.aidn;

        next();
    });

};

module.exports = verifyKeyMiddleware;