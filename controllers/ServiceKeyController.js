const generate = require('nanoid/generate');
const jwt = require("jsonwebtoken");
const ServiceKey = require("../models/ServiceKeyModel");
const generateSKIDN = require("../utils/GenerateSKIDN");

const rawSecret = process.env.SERVICEKEY_SECURITY_CODE;
const SECRET = Buffer.from(rawSecret, 'base64');

exports.createServiceKey = (req, res) => {
    const calling_aidn = req.body.calling_aidn;
    const recieving_aidn = req.body.recieving_aidn;
    const description = req.body.description;
    const name = req.body.name;
    const createdat = Date.now();
    const secureHash = generate("1234567890", 12);
    const service_key = jwt.sign({recieving_aidn, calling_aidn, createdat, secureHash}, SECRET);

    generateSKIDN(skidn => {
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
            console.log(err); // log to iris
            res.json({status:500, data:{errorCode:"internal_server_error"}});
        })
        .then(service_key => {
            console.log(service_key); // log to iris
            res.json({status:200, data:{service_key}});
        });
    });
};


exports.verifyServiceKey = (req, res) => {
    const service_key = req.body.service_key;
    const recieving_aidn = req.body.recieving_aidn;
    const calling_aidn = req.body.calling_aidn;
    
    jwt.verify(service_key, SECRET, (err, payload) => {
        if (err) {
            console.log("invalid_service_key"); // log to iris
            res.json({status:401, data:{errorCode:"invalid_service_key"}});
        }

        if (payload.recieving_aidn !== recieving_aidn) {
            console.log("recieving_aidn_mismatch"); // log to iris
            res.json({status:401, data:{errorCode:"recieving_aidn_mismatch"}});
        }

        if (payload.calling_aidn !== calling_aidn) {
            console.log("calling_aidn_mismatch"); // log to iris
            res.json({status:401, data:{errorCode:"calling_aidn_mismatch"}});
        }

        res.json({status:202, data:{statusCode:"verification_passed"}});

    });
};