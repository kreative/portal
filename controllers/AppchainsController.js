const Appchain = require("../models/AppchainModel");
const generateAIDN = require("../utils/GenerateAIDN");
const generateACN = require("../utils/GenerateACN");

exports.createAppchain = (req, res) => {
    const name = req.body.name;
    const oidn = req.body.oidn;
    const createdat = Date.now();

    generateACN(acn => 
        generateAIDN(aidn => {
            Appchain.create({
                acn,
                aidn,
                name,
                oidn,
                createdat
            })
            .catch(err => res.status(500).json({status: 500, data: err}))
            .then(appchain => res.status(202).json({status: 202, data: appchain}));
        }
    ));
};