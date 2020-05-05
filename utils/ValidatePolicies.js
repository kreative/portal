const Policy = require("../components/aim/policies/policy.model");

const validatePolicy = (_policy) => {
    return new Promise((resolve, reject) => {
        Policy.findOne({where:{policy:_policy}})
        .then(policy => {
            if (policy === null) reject(`policy_not_found: ${policy}`);
            else resolve();
        });
    });
};

const validatePolicies = (policies) => {
    return new Promise((resolve, reject) =>{
        Promise.all(policies.map(policy => validatePolicy(policy)))
        .catch(err => reject(err))
        .then(vals => resolve(202));
    })
};

module.exports = validatePolicies;