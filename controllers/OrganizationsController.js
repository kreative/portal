const Organization = require("../models/OrganizationModel");
const generateOIDN = require("../utils/GenerateOIDN");
const postage = require("../utils/PostageUtils");

exports.createOrganization = (req, res) => {
    const ksn = req.headers['portal_ksn'];
    const name = req.body.name;
    const admin_email = req.body.admin_email;
    const createdat = Date.now();

    generateOIDN(oidn => {
        Organization.create({
            oidn,
            ksn,
            name,
            admin_email,
            createdat
        })
        .catch(err => res.json({status: 500, data: err}))
        .then(org => {
            try {
                postage.sendNewOrganizationCreatedEmail(admin_email, name);
            }
            finally {
                res.json({status: 202, data: org});
            }
        });
    });
}
