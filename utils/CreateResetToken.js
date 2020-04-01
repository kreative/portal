const ResetToken = require("../models/ResetTokensModel");
const generate = require('nanoid/generate');

const generateToken = (callback) => {
    const newToken = parseInt(generate("1234567890", 12));
    
    ResetToken.findOne({where: {token: newToken}})
    .then(resetToken => {
        if (resetToken === null) callback(newToken);
        else this.generateToken();
    });
};

const createResetToken = (ksn) => {
    const createdat = Date.now();

    generateToken(token => {
        return new Promise((resolve, reject) => {
            ResetToken.create({
                token,
                ksn,
                createdat
            })
            .catch(err => reject(err))
            .then(resetToken => resolve(resetToken.token));
        });
    });
};

module.exports = createResetToken;