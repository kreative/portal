const Organization = require("../models/OrganizationModel");
const generate = require('nanoid/generate');

const generateOIDN = (callback) => {
    const newOIDN = parseInt(generate("1234567890", 16));
    
    Organization.findOne({where: {oidn: newOIDN}})
    .then(organization => {
        if (organization === null) callback(newOIDN);
        else this.generateOIDN();
    });
};

module.exports = generateOIDN;