const ResetCode = require("../components/accounts/resetcode.model");
const generate = require('nanoid/generate');

const generateCode = (callback) => {
    const newCode = parseInt(generate("1234567890", 6));
    
    ResetCode.findOne({where: {code: newCode}})
    .then(resetCode => {
        if (resetCode === null) callback(newCode);
        else this.generateCode();
    });
};

const createResetCode = (ksn) => {
    const createdat = Date.now();
    return new Promise((resolve, reject) => {
        generateCode(code => {
            ResetCode.create({
                code,
                ksn,
                createdat
            })
            .catch(err => reject(err))
            .then(resetCode => resolve(resetCode.code));
        });
    });
};

module.exports = createResetCode;