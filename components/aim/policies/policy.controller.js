const Policy = require("./policy.model");
const IRIS = require("../../../config/iris");

exports.createPolicy = (req, res) => {
  const policy = req.body.policy;
  const description = req.body.description;
  const associated_appchain = req.body.associated_appchain;
  const createdat = Date.now();

  IRIS.info("createPolicy started", { policy }, ["api"]);

  Policy.findOne({ where: { policy } }).then((_policy) => {
    if (_policy === null) {
      Policy.create({
        policy,
        description,
        associated_appchain,
        createdat,
      })
        .catch((err) => {
          IRIS.critical("Policy.create failed", { policy }, ["api", "ise"]);
          res.json({
            status: 500,
            data: { errorCode: "internal_server_error" },
          });
        })
        .then((policy) => {
          IRIS.info("policy created perfectly", { policy }, ["api", "success"]);
          res.json({ status: 200, data: { policy } });
        });
    } else {
      IRIS.warn("policy already existed", { policy }, ["api"]);
      res.json({ status: 401, data: { errorCode: "policy_already_exists" } });
    }
  });
};

// this method only updates the description field for the policy
// but not the actual policy itself
exports.updatePolicy = (req, res) => {
  const policy = req.body.policy;
  const description = req.body.description;

  IRIS.info("updatePolicy started", { policy }, ["api"]);

  Policy.update({ where: { policy } }, { description })
    .catch((err) => {
      IRIS.critical("updatePolicy failed", { policy, err }, ["api", "ise"]);
      res.json({ status: 500, data: { errorCode: "internal_server_error" } });
    })
    .then((update) => {
      IRIS.info("policy updated perfectly", { update }, ["api", "success"]);
      res.json({ status: 200, data: { update } });
    });
};

exports.deletePolicy = (req, res) => {
  const policy = req.body.policy;

  IRIS.info("deletePolicy started", { policy }, ["api"]);

  Policy.destroy({ where: { policy } })
    .catch((err) => {
      IRIS.critical("deletePolicy failed", { policy, err }, ["api", "ise"]);
      res.json({ status: 500, data: { errorCode: "internal_server_error" } });
    })
    .then(() => {
      IRIS.info("policy destroyed perfectly", { policy }, ["api", "success"]);
      res.json({ status: 200 });
    });
};

// used by the the KWS Control Panel to see if the
// admin can even create a policy with that name
exports.checkIfPolicyExists = (req, res) => {
  const policy = req.body.policy;

  IRIS.info("checkIfPolicyExists started", { policy }, ["api"]);

  Policy.findOne({ where: { policy } }).then((_policy) => {
    if (_policy === null)
      res.json({ status: 202, data: { policyExists: false } });
    else res.json({ status: 202, data: { policyExists: true } });
  });
};
