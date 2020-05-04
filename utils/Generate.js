const generate = require('nanoid/generate');
const Appchain = require("../components/appchains/appchain.model");
const Keychain = require("../components/accounts/keychain.model");
const Account = require("../components/accounts/account.model");
const Organization = require("../components/organizations/organization.model");
const Permit = require("../components/permits/permit.model");
const ServiceKey = require("../components/iam/AIMCertificateModel");
const Warrant = require("../components/warrants/warrant.model");

exports.acn = (callback) => {
    const newACN = parseInt(generate("1234567890", 16));
    
    Appchain.findOne({where: {acn: newACN}})
    .then(appchain => {
        if (appchain === null) callback(newACN);
        else this.acn();
    });
};

exports.aidn = (callback) => {
    const newAIDN = parseInt(generate("1234567890", 16));
    
    Appchain.findOne({where: {aidn: newAIDN}})
    .then(appchain => {
        if (appchain === null) callback(newAIDN);
        else this.aidn();
    });
};

exports.ccn = (callback) => {
    const newCCN = parseInt(generate("1234567890", 12));
    
    Keychain.findOne({where: {ccn: newCCN}})
    .then(keychain => {
        if (keychain === null) callback(newCCN);
        else this.ccn();
    });
};

exports.ksn = (callback) => {
    const newKSN = parseInt(generate("1234567890", 12));
    
    Account.findOne({where: {ksn: newKSN}})
    .then(account => {
        if (account === null) callback(newKSN);
        else this.ksn();
    });
};

exports.oidn = (callback) => {
    const newOIDN = parseInt(generate("1234567890", 16));
    
    Organization.findOne({where: {oidn: newOIDN}})
    .then(organization => {
        if (organization === null) callback(newOIDN);
        else this.oidn();
    });
};

exports.permitID = (callback) => {
    const newPermitID = parseInt(generate("1234567890", 12));

    Permit.findOne({where: {permit_id: newPermitID}})
    .then(permit => {
        if (permit === null) callback(newPermitID);
        else this.permitID();
    });
};

exports.skidn = (callback) => {
    const newSKIDN = parseInt(generate("1234567890", 16));
    
    ServiceKey.findOne({where: {skidn: newSKIDN}})
    .then(serviceKey => {
        if (serviceKey === null) callback(newSKIDN);
        else this.skidn();
    });
};

exports.warrantID = (callback) => {
    const newWarrantID = parseInt(generate("1234567890", 12));
    
    Warrant.findOne({where: {warrant_id: newWarrantID}})
    .then(warrant => {
        if (warrant === null) callback(newWarrantID);
        else this.warrantID();
    });
};