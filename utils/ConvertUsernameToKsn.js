const Account = require("../components/accounts/account.model");

const convertUsernameToKSN = (username) => {
    return new Promise((resolve, reject) => {
        Account.findOne({where: {username}})
        .then(account => {
            if (account === null) {
                reject({erroCode: "no_account_found"});
            }
            resolve(account.ksn);
        });
    });
};

module.exports = convertUsernameToKSN;