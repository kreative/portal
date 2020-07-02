const Appchain = require("./appchain.model");
const Organization = require("../organizations/organization.model");
const generate = require("../../utils/Generate");
const deletePermits = require("../../utils/DeletePermits");

exports.createAppchain = (req, res) => {
  const name = req.body.name;
  const oidn = req.body.oidn;
  const createdat = Date.now();

  Organization.findOne({ where: { oidn } }).then((org) => {
    if (org === null) {
      res.json({ status: 404, data: { errorCode: "organization_not_found" } });
    } else {
      generate.acn((acn) =>
        generate.aidn((aidn) => {
          Appchain.create({
            acn,
            aidn,
            name,
            oidn,
            createdat,
          })
            .catch((error) => {
              console.log(error);
              res.json({ status: 500, data: { errorCode: "ISE" } });
            })
            .then((appchain) => {
              res.json({ status: 202, data: appchain });
            });
        })
      );
    }
  });
};

// returns list of appchains belonging to a KSN
exports.getAppchains = (req, res) => {
  Appchain.findAll()
    .then((appchains) => res.json({ status: 202, data: appchains }))
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    });
};

exports.deleteAppchain = (req, res) => {
  Appchain.findOne({ where: { acn: req.params.acn } })
    .catch((error) => {
      res.json({ status: 404, data: { errorCode: "AppchainNotFound" } });
    })
    .then((appchain) => {
      console.log(appchain)
      deletePermits
        .fromAIDN(appchain.aidn)
        .catch((error) => {
          console.log(error);
          res.json({ status: 500, data: { errorCode: "ISE" } })
        })
        .then((values) => {
          console.log(values)
          Appchain.destroy({ where: { acn: req.params.acn } })
            .then(() => res.json({ status: 202 }))
            .catch((error) => {
              console.log(error);
              res.json({ status: 500, data: { errorCode: "ISE" } });
            });
        });
    });
};
