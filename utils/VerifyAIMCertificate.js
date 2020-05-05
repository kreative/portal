const Certificate = require("../components/aim/certificates/certificate.model");

const verifyAIMCertificate = (access_token, identity_token, policy) => {
    return new Promise((resolve, reject) => {
        Certificate.findOne({where:{identity_token}})
        .then(certificate => {
            if (certificate === null) reject("invalid_identity_token");
            if (certificate.access_token !== access_token) reject("invalid_access_token");
            if (!certificate.policies.includes(policy)) reject("policy_access_denied");

            resolve();
        });
    });
};

module.exports = verifyAIMCertificate;