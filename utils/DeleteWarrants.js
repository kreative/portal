const Warrant = require("../components/warrants/warrant.model");

const deleteWarrant = (warrant) => {
  return new Promise((resolve, reject) => {
    Warrant.destroy({ where: { warrant_id: warrant.warrant_id } })
      .catch((err) => reject(err))
      .then(() => resolve(202));
  });
};

exports.fromPermitID = (permit_id) => {
  return new Promise((resolve, reject) => {
    Warrant.findAll({ where: { permit_id } })
      .catch((error) => reject(error))
      .then((warrants) => {
        if (warrants === null) {
          resolve("NoWarrantsFound");
        }
        else {
          Promise.all(warrants.map((w) => deleteWarrant(w)))
            .catch((error) => reject(error))
            .then((values) => resolve(values));
        }
      })
  })
};
