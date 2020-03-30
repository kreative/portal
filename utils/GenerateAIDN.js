const Appchain = require("../models/AppchainModel");
const generate = require('nanoid/generate');

const generateAIDN = (callback) => {
    const newAIDN = parseInt(generate("1234567890", 16));
    
    Appchain.findOne({where: {aidn: newAIDN}})
    .then(appchain => {
        if (appchain === null) callback(newAIDN);
        else this.generateAIDN();
    });
};

module.exports = generateAIDN;