const Appchain = require("./appchain.model");
const Organization = require("../organizations/organization.model");
const generate = require("../../utils/Generate");
const postage = require("../../lib/postage/postage.utils");
const IRIS = require("../../config/iris");

exports.createAppchain = (req, res) => {
  const name = req.body.name;
  const oidn = req.body.oidn;
  const createdat = Date.now();

  IRIS.info("creating appchain started", { name, oidn }, ["api"]);

  Organization.findOne({ where: { oidn } }).then((org) => {
    if (org === null) {
      IRIS.warn(
        "organization for appchain was not started, though it should",
        { oidn },
        ["api"]
      );
      res.json({ status: 404, data: { errorCode: "organization_not_found" } });
    }

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
  });
};

// returns list of appchains belonging to a KSN
exports.getAppchains = (req, res) => {
  Appchain.findAll()
    .then((appchains) => res.json({ status: 202, data: appchains }))
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
};

exports.deleteAppchain = (req, res) => {
  Appchain.destroy({ where: { acn: req.params.acn } })
    .catch((err) => {
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then(() => {
      res.json({ status: 202 });
    });
};
