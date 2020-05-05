const Certificate = require("./certificate.model");
const generate = require("../../../utils/Generate");
const verifyAIMCertificate = require("../../../utils/VerifyAIMCertificate");
const validatePolicies = require("../../../utils/ValidatePolicies");
const IRIS = require("../../../config/iris");

exports.createCertificate = (req, res) => {
    const policies = req.body.policies;
    const description = req.body.description;
    const name = req.body.name;
    const createdat = Date.now();

    IRIS.info("createCertificate started",{policies},["api"]);

    validatePolicies(policies)
    .catch(err => {
        IRIS.warn("validatePolicies failed",{err,policies},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(() => {
        generate.certificateID(certificate_id => {
            generate.identityToken(identity_token => {
                generate.accessToken(access_token => {
                    Certificate.create({
                        certificate_id,
                        access_token,
                        identity_token,
                        policies,
                        name,
                        description,
                        createdat
                    })
                    .catch(err => {
                        IRIS.critical("Certificate.create failed",{certificate_id,err},["api","catch"]);
                        res.json({status:500, data:{errorCode:"internal_server_error"}});
                    })
                    .then(certificate => {
                        IRIS.info("certificate created perfectly",{skidn},["api","success"]);
                        res.json({status:200, data:{certificate}});
                    });
                });
            });
        });
    });
};


exports.getServiceKeys = (req, res) => {};


exports.verifyCertificate = (req, res) => {
    const identity_token = req.body.identity_token;
    const access_token = req.body.access_token;
    const policy = req.body.policy;

    IRIS.info("verifyCertificate api method started",{identity_token},["api"]);

    verifyAIMCertificate(identity_token, access_token, policy)
    .catch(errorCode => {
        IRIS.info(errorCode,{identity_token},["api"]);
        res.json({status:401, data:{errorCode}});
    })
    .then(() => {
        IRIS.info("certificate verification passed",{identity_token},["api","success"]);
        res.json({status:202, data:{statusCode:"verification_passed"}});
    });
};


exports.deleteCertificate = (req, res) => {
    const certificate_id = req.body.certificate_id;

    IRIS.info("deleteCertificate started",{certificate_id},["api"]);

    Certificate.destroy({where:{certificate_id}})
    .catch(err => {
        IRIS.critical("Certificate.destroy failed",{certificate_id,err},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(() => {
        IRIS.info("certificate destroyed perfectly",{certificate_id},["api","success"]);
        res.json({status:202});
    })
}