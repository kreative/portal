const Appchain = require("../models/AppchainModel");
const generate = require('nanoid/generate');

const generateACN = (callback) => {
    const newACN = parseInt(generate("1234567890", 16));
    
    Appchain.findOne({where: {acn: newACN}})
    .then(appchain => {
        if (appchain === null) callback(newACN);
        else this.generateACN();
    });
};

module.exports = generateACN;