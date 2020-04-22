const Appchain = require("../models/AppchainModel");
const Organization = require("../models/OrganizationModel");
const generateAIDN = require("../utils/GenerateAIDN");
const generateACN = require("../utils/GenerateACN");
const postage = require("../utils/PostageUtils");

exports.createAppchain = (req, res) => {
    const name = req.body.name;
    const oidn = req.body.oidn;
    const createdat = Date.now();

    Organization.findOne({where: {oidn}})
    .then(org => {
        if (org === null) {
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
                .catch(err => res.json({status: 500, data: err}))
                .then(appchain => {
                    try {
                        postage.sendNewAppchainCreatedEmail(org.admin_email, name);
                    }
                    finally {
                        res.json({status: 202, data: appchain});   
                    }
                });
            }
        ));
    });
};

exports.deleteAppchain = (req, res) => {
    const aidn = req.body.aidn;

    Appchain.destroy({where:{aidn}})
    .catch(err => {
        console.log(err); //log to iris
        res.json({status:500, data:{errorCode: "internal_server_error"}});
    })
    .then(() => {
        //log to iris
        res.json({status:202});
    });
};