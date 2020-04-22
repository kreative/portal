const ServiceKey = require("../models/ServiceKeyModel");
const generate = require('nanoid/generate');

const generateSKIDN = (callback) => {
    const newSKIDN = parseInt(generate("1234567890", 16));
    
    ServiceKey.findOne({where: {skidn: newSKIDN}})
    .then(serviceKey => {
        if (serviceKey === null) callback(newSKIDN);
        else this.generateSKIDN();
    });
};

module.exports = generateSKIDN;