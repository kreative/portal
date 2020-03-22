const Keychain = require("../models/KeychainModel");
const generate = require('nanoid/generate');

const generateCCN = (callback) => {
    const newCCN = parseInt(generate("1234567890", 12));
    
    Keychain.findOne({where: {ccn: newCCN}})
    .then(keychain => {
        if (keychain === null) callback(newCCN);
        else this.generateCCN();
    });
};

module.exports = generateCCN;