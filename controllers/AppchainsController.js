const Appchain = require("../models/AppchainModel");
const Organization = require("../models/OrganizationModel");
const generateAIDN = require("../utils/GenerateAIDN");
const generateACN = require("../utils/GenerateACN");
const postage = require("../utils/PostageUtils");
const IRIS = require("../config/iris");

exports.createAppchain = (req, res) => {
    const name = req.body.name;
    const oidn = req.body.oidn;
    const createdat = Date.now();

    IRIS.info("creating appchain started",{name,oidn},["api"]);

    Organization.findOne({where: {oidn}})
    .then(org => {
        if (org === null) {
            IRIS.warn("organization for appchain was not started, though it should",{oidn},["api"]);
            res.json({status: 404, data: {errorCode: "organization_not_found"}});
        }

        generateACN(acn => 
            generateAIDN(aidn => {
                Appchain.create({
                    acn,
                    aidn,
                    name,
                    oidn,
                    createdat
                })
                .catch(err => {
                    IRIS.critical("creating appchain failed",{aidn,acn,oidn},["api","ise"]);
                    res.json({status: 500, data: err})
                })
                .then(appchain => {
                    try {
                        postage.sendNewAppchainCreatedEmail(org.admin_email, name);
                    }
                    catch (err) {
                        IRIS.error("sending new appchain created email failed",{aidn},["api"]);
                    }
                    finally {
                        IRIS.info("appchain created perfectly",{acn},["api","success"]);
                        res.json({status: 202, data: appchain});   
                    }
                });
            }
        ));
    });
};


// returns list of appchains belonging to a KSN
exports.getAppchains = (req, res) => {};


exports.deleteAppchain = (req, res) => {
    const aidn = req.body.aidn;

    IRIS.info("deleting appchain started",{aidn},["api"]);

    Appchain.destroy({where:{aidn}})
    .catch(err => {
        IRIS.critical("Appchain.destroy failed",{aidn},["api","catch"]);
        res.json({status:500, data:{errorCode: "internal_server_error"}});
    })
    .then(() => {
        IRIS.info("destroyed appchain perfectly",{aidn},["api","success"])''
        res.json({status:202});
    });
};