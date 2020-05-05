const verifyServiceKeyUtil = require("../utils/VerifyAIMCertificate");
const IRIS = require("../config/iris");

const verifyServiceKey = (req, res, next) => {
    const service_key = req.headers["portal_service_key"];
    const recieving_aidn = process.env.AIDN;
    const calling_aidn = req.headers["portal_calling_aidn"];
    
    IRIS.info("verifyServiceKey middleware started",{service_key,recieving_aidn,calling_aidn},["api"]);

    verifyServiceKeyUtil(service_key, recieving_aidn, calling_aidn)
    .catch(errorCode => {
        IRIS.info(errorCode,{service_key},["api"]);
        res.json({status:401, data:{errorCode}});
    })
    .then(() => {
        IRIS.info("service key verification passed in middleware",{service_key},["api","success"]);
        res.locals.calling_aidn = calling_aidn;
        next();
    });
};

module.exports = verifyServiceKey;