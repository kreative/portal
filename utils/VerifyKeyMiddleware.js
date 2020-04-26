const verifyKey = require("../utils/VerifyKey");
const IRIS = require("../config/iris");

const verifyKeyMiddleware = (req, res, next) => {
    const key = req.headers['portal_key'];
    const ksn = req.headers['portal_ksn'];
    const aidn = req.headers['portal_aidn'];

    IRIS.info("verifyKeyMiddleware initiated",{key,ksn,aidn},["api"]);

    verifyKey(key, ksn, aidn)
    .catch(err => {
        const status = err.status;
        const errorCode = err.code;

        res.json({status, data:{errorCode}});
    })
    .then(info => {
        res.locals.ksn = info.ksn;
        res.locals.ccn = info.ccn;
        res.locals.aidn = info.aidn;

        next();
    });

};

module.exports = verifyKeyMiddleware;