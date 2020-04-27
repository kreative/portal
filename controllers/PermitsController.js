const Permit = require("../models/PermitModel");
const generate = require("../utils/Generate");
const IRIS = require("../config/iris");

const scopes = ["organization","app"];

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


exports.getPermits = (req, res) => {};


exports.updatePermit = (req, res) => {};


exports.deactivatePermit = (req, res) => {};


exports.deletePermit = (req, res) => {};