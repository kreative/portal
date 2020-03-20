const Account = require("../models/AccountModel");
const generate = require('nanoid/generate');

const generateKSN = (callback) => {
    console.log("generateKSN started");
    const newKSN = parseInt(generate("1234567890", 12));
    
    Account.findOne({where: {ksn: newKSN}})
    .then(account => {
        if (account === null) {
            callback(newKSN);
        }
        else {
            this.generateKSN();
        }
    });
};

module.exports = generateKSN;