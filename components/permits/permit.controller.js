const Permit = require("./permit.model");
const generate = require("../../utils/Generate");
const IRIS = require("../../config/iris");

const scopes = ["organization","app"];

// creating a permit is made in the Portal DevHub
// and is not called by the application itself, that is why
// it uses verifyKey not verifyServiceKey
exports.createPermit = (req, res) => {
    const designated_app = req.body.designated_app;
    const permit_token = req.body.permit_token;
    const description = req.body.description;
    const scope = req.body.scope;
    const issuing_ksn = res.locals.ksn;
    const createdat = Date.now();
    const active = true;

    IRIS.info("createPermit started",{designated_app,permit_token,issuing_ksn},["api"]);

    if (!scopes.includes(scope)) {
        IRIS.warn("incorrect scope was provided",{designated_app,permit_token,scope},["api"]);
        res.json({status:401, data:{errorCode:"invalid_scope",scope}});
    }
    else {
        generate.permitID(permit_id => {
            Permit.create({
                permit_id,
                active,
                designated_app,
                permit_token,
                description,
                scope,
                issuing_ksn,
                createdat
            })
            .catch(err => {
                IRIS.critical("Permit.create failed", {permit_id,designated_app,permit_token,err},["api","ise"]);
                res.json({status:500, data:{errorCode:"internal_server_error"}});
            })
            .then(permit => {
                IRIS.info("permit created perfectly",{permit_id},["api","success"]);
                res.json({status:202, data:{permit}});
            });
        });
    }
};


// this is used so that a developer can get permits
// for their app in the Portal DevHub
exports.getPermitsForApp = (req, res) => {
    const designated_app = req.body.designated_app;

    IRIS.info("getPermitsForApp started",{designated_app},["api"]);

    Permit.findAll({where:{designated_app}})
    .catch(err => {
        IRIS.critical("Permit.findAll failed @ForApp",{designated_app,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(permits => {
        IRIS.info("found permits perfectly",{designated_app},["api","success"]);
        res.json({status:202, data:{permits}});
    })
};


// this is used so that a developer can get permits
// that they own/issued
exports.getPermitsForDev = (req, res) => {
    const issuing_ksn = res.locals.ksn;

    IRIS.info("getPermitsForDev started",{issuing_ksn},["api"]);

    Permit.findAll({where:{issuing_ksn}})
    .catch(err => {
        IRIS.critical("Permit.findAll failed @ForDev",{issuing_ksn,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(permits => {
        IRIS.info("found permits perfectly",{issuing_ksn},["api","success"]);
        res.json({status:202, data:{permits}});
    })
};


// like the methods up adove, this is used by the Portal DevHub
exports.updatePermit = (req, res) => {
    const permit_id = req.body.permit_id;
    const description = req.body.description;
    const permit_token = req.body.permit_token;
    const scope = req.body.scope;

    IRIS.info("updatePermits started",{permit_id},["api"]);

    Permit.update({description,permit_token,scope},{where:{permit_id}})
    .catch(err => {
        IRIS.critical("Permit.update failed",{permit_id,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        IRIS.info("permit updated perfectly",{permit_id},["api","success"]);
        res.json({status:202, data:{update}});
    })
};


exports.deactivatePermit = (req, res) => {
    const permit_id = req.body.permit_id;
    const active = false;

    IRIS.info("deactivatePermit started",{permit_id},["api"]);

    Permit.update({active},{where:{permit_id}})
    .catch(err => {
        IRIS.critical("Permit.update failed @deactivatePermit",{permit_id,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        IRIS.info("permit deactivated perfectly",{permit_id},["api","success"]);
        res.json({status:202, data:{update}});
    });
};


exports.deletePermit = (req, res) => {
    const permit_id = req.body.permit_id;

    IRIS.info("deletePermit started",{permit_id},["api"]);

    Permit.destroy({where:{permit_id}})
    .catch(err => {
        IRIS.critical("Permit.destroy failed",{permit_id,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(() => {
        IRIS.info("permit deleted perfectly",{permit_id},["api","success"]);
        res.json({status:202, data:{update}});
    });
};