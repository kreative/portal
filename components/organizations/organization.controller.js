const Organization = require("./organization.model");
const generate = require("../../utils/Generate");
const postage = require("../../utils/PostageUtils");
const IRIS = require("../../config/iris");

exports.createOrganization = (req, res) => {
    const ksn = req.headers['portal_ksn'];
    const name = req.body.name;
    const admin_email = req.body.admin_email;
    const createdat = Date.now();

    IRIS.info("creating organization started",{ksn,admin_email},["api"]);

    generate.oidn(oidn => {
        Organization.create({
            oidn,
            ksn,
            name,
            admin_email,
            createdat
        })
        .catch(err => {
            IRIS.critical("Organization.create failed",{ksn,admin_email},["api","ise"]);
            res.json({status: 500, data: err})
        })
        .then(org => {
            try {
                postage.sendNewOrganizationCreatedEmail(admin_email, name);
            }
            catch (err) {
                IRIS.error("sendNewOrganizationCreatedEmail failed",{admin_email,oidn},["api","catch"]);
            }
            finally {
                IRIS.info("organization created perfectly",{oidn},["api","success"]);
                res.json({status: 202, data: org});
            }
        });
    });
};

// returns list of organizations belonging to a KSN
exports.getOrganizations = (req, res) => {}


exports.updateOrganization = (req, res) => {};


exports.removeOrganization = (req, res) => {};
