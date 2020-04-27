const IRIS = require("../config/iris");

const validateRedirectData = (req, res, next) => {
    const appNameRaw = req.query.appname;
    const callback = req.query.callback;
    const aidn = req.query.aidn;
    
    if ([appNameRaw, callback, aidn].some((val) => val === undefined)) {
        IRIS.warn("redirect data was invalidated",{appNameRaw,callback,aidn},["api"]);
        res.redirect("/404");
    }
    else {
        res.locals.callback = callback;
        res.locals.aidn = aidn;
        res.locals.appName = appNameRaw.replace("+", " ");
    
        next();
    }
};

module.exports = validateRedirectData;