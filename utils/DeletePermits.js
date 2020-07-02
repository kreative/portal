const Permit = require("../components/permits/permit.model");
const deleteWarrants = require("./DeleteWarrants");

const deletePermit = (permit) => {
  return new Promise((resolve, reject) => {
    const permit_id = permit.permit_id;
    Permit.destroy({ where: { permit_id } })
      .catch((error) => reject(error))
      .then(() => {
        deleteWarrants.fromPermitID(permit_id)
          .catch((error) => reject(error))
          .then((values) => resolve(202));
      });
  });
};

exports.fromAIDN = (aidn) => {
  return new Promise((resolve, reject) => {
    Permit.findAll({ where: { designated_app: aidn } })
      .catch((error) => reject(error))
      .then((permits) => {
        if (permits === null) {
          resolve("NoPermitsFound");
        }
        else {
          Promise.all(permits.map((p) => deletePermit(p)))
            .catch((error) => reject(error))
            .then((values) => resolve(values));
        }
      });
  });
};
