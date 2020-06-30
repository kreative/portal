const Permit = require("../components/permits/permit.model");

const deletePermit = (permit) => {
  Permit.destroy({ where: { permit_id: permit.permit_id } })
    .catch((error) => reject(error))
    .then(() => resolve(202));
};

exports.fromAIDN = (aidn) => {
  return new Promise((resolve, reject) => {
    Permit.findAll({ where: { aidn } })
      .catch((error) => reject(error))
      .then((permits) => {
        Promise.all(permits.map((p) => deletePermit(p)))
          .catch((error) => reject(error))
          .then((values) => resolve(values));
      });
  });
};
