const Organization = require("./organization.model");
const generate = require("../../utils/Generate");

exports.createOrganization = (req, res) => {
  const ksn = req.headers["portal_ksn"] || 605249861408;
  const name = req.body.name;
  const admin_email = req.body.admin_email;
  const createdat = Date.now();

  generate.oidn((oidn) => {
    Organization.create({
      oidn,
      ksn,
      name,
      admin_email,
      createdat,
    })
      .then((org) => res.json({ status: 202, data: org }))
      .catch((err) => {
          console.log(err);
          res.json({ status: 500, data: { errorCode: "ISE" } })
      });
  });
};

exports.getOrganizations = (req, res) => {
  Organization.findAll()
    .then((organizations) => res.json({ status: 202, data: { organizations } }))
    .catch((error) => {
        console.log(error);
        res.json({ status: 500, data: { errorCode: "ISE" } })
    });
};

exports.updateOrganization = (req, res) => {
  Organization.update({
    name: req.body.name,
    admin_email: req.body.admin_email,
  })
    .then((update) => res.json({ status: 200 }))
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    });
};

exports.removeOrganization = (req, res) => {
  Organization.destroy({ where: { oidn: req.params.oidn } })
    .then(() => res.json({ status: 202 }))
    .catch((error) => {
        console.log(error);
        res.json({ status: 500, data: { errorCode: "ISE" } })
    });
};
