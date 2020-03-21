const Keychain = require("../models/AccountModel");
const generate = require('nanoid/generate');

const generateCCN = (callback) => {
    const newCCN = parseInt(generate("1234567890", 12));
    
    Keychain.findOne({where: {ccn: newCCN}})
    .then(account => {
        if (account === null) callback(newCCN);
        else this.generateCCN();
    });
};

module.exports = generateCCN;