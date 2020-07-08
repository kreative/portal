const Permit = require("./permit.model");
const generate = require("../../utils/Generate");

const scopes = ["organization", "app"];

// creating a permit is made in the Portal DevHub
// and is not called by the application itself, that is why
// it uses verifyKey not verifyServiceKey
exports.createPermit = (req, res) => {
  const designated_app = req.body.designated_app;
  const permit_token = req.body.permit_token;
  const description = req.body.description;
  const scope = req.body.scope;
  const issuing_ksn = res.locals.ksn || 605249861408;
  const createdat = Date.now();
  const active = true;

  if (!scopes.includes(scope)) {
    res.json({ status: 401, data: { errorCode: "invalid_scope", scope } });
  } else {
    generate.permitID((permit_id) => {
      Permit.create({
        permit_id,
        active,
        designated_app,
        permit_token,
        description,
        scope,
        issuing_ksn,
        createdat,
      })
        .catch((error) => {
          console.log(error);
          res.json({ status: 500, data: { errorCode: "ISE" } });
        })
        .then((permit) => {
          res.json({ status: 202, data: { permit } });
        });
    });
  }
};

// returns all permits
exports.getPermits = (req, res) => {
  Permit.findAll()
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then((permits) => {
      res.json({ status: 202, data: permits });
    });
};

// like the methods up adove, this is used by the Portal DevHub
exports.updatePermit = (req, res) => {
  const permit_id = req.params.permit_id;
  const description = req.body.description;
  const permit_token = req.body.permit_token;
  const scope = req.body.scope;

  Permit.update({ description, permit_token, scope }, { where: { permit_id } })
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then((update) => {
      res.json({ status: 202, data: { update } });
    });
};

exports.deactivatePermit = (req, res) => {
  Permit.update({ active: false }, { where: { permit_id: req.params.permit_id } })
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then((update) => {
      res.json({ status: 202, data: { update } });
    });
};

exports.activatePermit = (req, res) => {
  Permit.update({ active: true }, { where: { permit_id: req.params.permit_id } })
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then((update) => {
      res.json({ status: 202, data: { update } });
    });
};

exports.deletePermit = (req, res) => {
  Permit.destroy({ where: { permit_id: req.params.permit_id } })
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
    .then(() => {
      res.json({ status: 202, data: { update } });
    });
};
