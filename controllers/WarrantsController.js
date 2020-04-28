const Warrant = require("../models/WarrantModel");
const Permit = require("../models/PermitModel");
const generate = require("../utils/Generate");
const IRIS = require("../config/iris");


exports.createWarrant = (req, res) => {
    const ksn = req.body.ksn;
    const issuing_app = res.locals.calling_aidn;
    const permit_token = req.body.permit_token;
    const active = true;
    const createdat = Date.now();

    IRIS.info("createWarrant started",{ksn,issuing_app,permit_token},["api"]);

    Permit.findOne({where:{permit_token}})
    .catch(err => {
        IRIS.critical("Permit.findOne failed, it shouldnt",{permit_token,ksn,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(permit => {
        if (permit === null) {
            IRIS.warn("permit wasnt found using permit_token",{permit_token,ksn},["api"]);
            res.json({status:404, data:{errorCode:"permit_not_found"}});
        }
        else {
            const permit_id = permit.permit_id;

            generate.warrantID(warrant_id => {
                Warrant.create({
                    warrant_id,
                    active,
                    permit_id,
                    ksn,
                    issuing_app,
                    createdat
                })
                .catch(err => {
                    IRIS.critical("Warrant.create failed",{warrant_id,permit_token,err},["api","ise"]);
                    res.json({status:500, data:{errorCode:"internal_server_error"}});
                })
                .then(warrant => {
                    IRIS.info("warrant created successfully",{warrant},["api","success"]);
                    res.json({status:202, data:{warrant}});
                });
            });
        }
    })
};


// returns a boolean to represent whether or not
// a warrant exists for a given KSN
exports.checkForWarrant = (req, res) => {
    const ksn = req.body.ksn;
    const permit_token = req.body.permit_token;
    const active = true;

    Permit.findOne({where: {permit_token}})
    .catch(err => {
        IRIS.critical("Permit.findOne failed",{ksn,permit_token,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(permit => {
        if (permit === null) {
            IRIS.info("permit not found perfectly",{ksn,permit_token},["api","success"]);
            res.json({status:404, data:{errorCode:"permit_not_found"}});
        }
        else {
            const permit_id = permit.permit_id;

            Warrant.findOne({where: {ksn, permit_id, active}})
            .catch(err => {
                IRIS.critical("Warrant.findOne failed",{ksn,permit_token,err},["api","ise"]);
                res.json({status:500, data:{errorCode:"internal_server_error"}});
            })
            .then(warrant => {
                if (warrant === null) {
                    IRIS.info("warrant not found perfectly",{ksn,permit_token},["api","success"]);
                    res.json({status:202, data:{has_warrant: false}});
                }
                else {
                    const warrant_id = warrant.warrant_id;

                    IRIS.info("warrant was found perfectly",{warrant_id,ksn,permit_token},["api","success"]);
                    res.json({status:202, data:{has_warrant: true, warrant}});
                }
            });
        }
    });
};


// returns only the warrants for the app calling this request
// for a given KSN
exports.getWarrantsForAccount = (req, res) => {
    const ksn = req.body.ksn;
    const issuing_app = res.locals.calling_aidn;

    IRIS.info("getting warrant for account started",{ksn,issuing_app},["api"]);

    Warrant.findAll({where:{ksn,issuing_app}})
    .catch(err => {
        IRIS.critical("Warrant.findAll failed",{ksn,issuing_app,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(warrants => {
        IRIS.info("warrants were found perfectly",{ksn,issuing_app},["api","success"]);
        res.json({status:202, data:{warrants}});
    });
};


// can only be called by the admin of the appchain
// this method is used in the Portal DevHub to view warrants
exports.getWarrantsForApp = (req, res) => {
    const issuing_app = req.body.issuing_app;

    IRIS.info("get warrants for app started",{issuing_app},["api"]);

    Warrant.findAll({where:{issuing_app}})
    .catch(err => {
        IRIS.critical("Warrant.findAll failed @ForApp",{issuing_app,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(warrants => {
        IRIS.info("warrants were found perfectly @ForApp",{issuing_app},["api","success"]);
        res.json({status:202, data:{warrants}});
    });
};


// we want to keep a track of all the warrants,
// therefore they do not get removed from the DB
// but instead deactivated
exports.deactivateWarrant = (req, res) => {
    const warrant_id = req.body.warrant_id;
    const active = false;

    IRIS.info("deactivate warrant started",{warrant_id},["api"]);

    Warrant.update({active},{where:{warrant_id}})
    .catch(err => {
        IRIS.critical("Warrant.update failed @deactivate",{warrant_id,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(update => {
        IRIS.info("warrant was deactivated perfectly",{warrant_id},["api","success"]);
        res.json({status:202, data:{deactivated:true}});
    });
};