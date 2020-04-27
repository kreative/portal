const Warrant = require("../models/WarrantModel");
const Permit = require("../models/PermitModel");
const generate = require("../utils/Generate");
const IRIS = require("../config/iris");


exports.createWarrant = (req, res) => {
    const ksn = req.body.ksn;
    const issuing_app = res.locals.calling_aidn;
    const permit_token = req.body.permit_token;
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
exports.checkForWarrant = (req, res) => {};


// returns only the warrants for the app calling this request
exports.getWarrantsForAccount = (req, res) => {};


// can only be called by the admin of the appchain
exports.getWarrantsForApp = (req, res) => {};


exports.updateWarrant = (req, res) => {};


exports.deleteWarrant = (req, res) => {};