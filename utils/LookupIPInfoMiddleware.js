const ipinfo = require("../config/ipinfo");

const lookupIPInfoMiddleware = (req, res, next) => {
    const ipAddr = res.locals.clientIpAddr;
    
    ipinfo.lookupIp(ipAddr)
    .then(info => {
        res.locals.clientIPInfo = info;
        next();
    });
};

module.exports = lookupIPInfoMiddleware;