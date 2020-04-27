const ipware = require("ipware");
const getIp = ipware().get_ip;

const getIPMiddleware = (req, res, next) => {
    const ipInfo = getIp(req);
    const ipAddr = ipInfo.clientIp;
    res.locals.clientIpAddr = ipAddr;
    next();
};

module.exports = getIPMiddleware;