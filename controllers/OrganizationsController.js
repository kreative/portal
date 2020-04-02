const Organization = require("../models/OrganizationModel");
const generateOIDN = require("../utils/GenerateOIDN");
const postage = require("../utils/PostageUtils");

exports.createOrganization = (req, res) => {
    const name = req.body.name;
    const admin_email = req.body.admin_email;
    const createdat = Date.now();

    generateOIDN(oidn => {
        Organization.create({
            oidn,
            name,
            admin_email,
            createdat
        })
        .catch(err => res.status(500).json({status: 500, data: err}))
        .then(org => {
            try {
                postage.sendNewOrganizationCreatedEmail(admin_email, name);
            }
            finally {
                res.status(292).json({status: 202, data: org});
            }
        });
    });
}
