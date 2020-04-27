const nanoidGenerate = require('nanoid/generate');
const jwt = require("jsonwebtoken");
const ServiceKey = require("../models/ServiceKeyModel");
const generate = require("../utils/Generate");
const IRIS = require("../config/iris");

const rawSecret = process.env.SERVICEKEY_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

exports.createServiceKey = (req, res) => {
    const calling_aidn = req.body.calling_aidn;
    const recieving_aidn = req.body.recieving_aidn;
    const description = req.body.description;
    const name = req.body.name;
    const createdat = Date.now();
    const secureHash = nanoidGenerate("1234567890", 12);
    const service_key = jwt.sign({recieving_aidn, calling_aidn, createdat, secureHash}, SECRET);

    IRIS.info("createServiceKey started",{calling_aidn,recieving_aidn},["api"]);

    generate.skidn(skidn => {
        ServiceKey.create({
            skidn,
            service_key,
            calling_aidn,
            recieving_aidn,
            name,
            description,
            createdat
        })
        .catch(err => {
            IRIS.critical("ServiceKey.create failed",{skidn,err},["api","catch"]);
            res.json({status:500, data:{errorCode:"internal_server_error"}});
        })
        .then(service_key => {
            IRIS.info("service key created perfectly",{skidn},["api","success"]);
            res.json({status:200, data:{service_key}});
        });
    });
};


exports.getServiceKeys = (req, res) => {};


exports.verifyServiceKey = (req, res) => {
    const service_key = req.body.service_key;
    const recieving_aidn = req.body.recieving_aidn;
    const calling_aidn = req.body.calling_aidn;

    IRIS.info("verifyServiceKey started",{service_key,recieving_aidn,calling_aidn},["api"]);
    
    jwt.verify(service_key, SECRET, (err, payload) => {
        if (err) {
            IRIS.info("service key was invalid",{service_key},["api"]);
            res.json({status:401, data:{errorCode:"invalid_service_key"}});
        }
        else if (payload.recieving_aidn !== recieving_aidn) {
            IRIS.info("recieving_aidn mismatch",{service_key},["api"]);
            res.json({status:401, data:{errorCode:"recieving_aidn_mismatch"}});
        }
        else if (payload.calling_aidn !== calling_aidn) {
            IRIS.info("calling_aidn mismatch",{service_key},["api"]);
            res.json({status:401, data:{errorCode:"calling_aidn_mismatch"}});
        }
        else {
            IRIS.info("service key verification passed",{service_key},["api","success"]);
            res.json({status:202, data:{statusCode:"verification_passed"}});
        }
    });
};


exports.deleteServiceKey = (req, res) => {
    const skidn = req.body.skidn;

    IRIS.info("deleteServiceKey started",{skidn},["api"]);

    ServiceKey.destroy({where:{skidn}})
    .catch(err => {
        IRIS.critical("ServiceKey.destroy failed",{skidn},["api","ise"]);
        res.json({status:500, data:{errorCode:"internal_server_error"}});
    })
    .then(() => {
        IRIS.info("destroyed service key perfectly",{skidn},["api","success"]);
        res.json({status:202});
    })
}