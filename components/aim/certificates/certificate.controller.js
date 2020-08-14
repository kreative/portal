const Certificate = require("./certificate.model");
const generate = require("../../../utils/Generate");
const verifyAIMCertificate = require("../../../utils/VerifyAIMCertificate");

exports.createCertificate = (req, res) => {
  const description = req.body.description;
  const name = req.body.name;
  const createdat = Date.now();

  generate.certificateID((certificate_id) => {
    generate.identityToken((identity_token) => {
      generate.accessToken((access_token) => {
        Certificate.create({
          certificate_id,
          access_token,
          identity_token,
          name,
          description,
          createdat,
        })
          .catch((err) => res.json({ status: 500, data: { errorCode: "ISE" } }))
          .then((certificate) => res.json({ status: 200, data: { certificate } }));
      });
    });
  });
};

exports.getCertificates = (req, res) => {
  Certificate.findAll()
    .then((certificates) => res.json({ status: 202, data: certificates }))
    .catch((error) => {
      console.log(error);
      res.json({ status: 500, data: { errorCode: "ISE" } });
    })
};

exports.getServiceKeys = (req, res) => {};

exports.verifyCertificate = (req, res) => {
  const identity_token = req.body.identity_token;
  const access_token = req.body.access_token;

  verifyAIMCertificate(access_token, identity_token)
    .catch((errorCode) => res.json({ status: 401, data: { errorCode } }))
    .then(() => res.json({ status: 202 }));
};

exports.deleteCertificate = (req, res) => {
  Certificate.destroy({ where: { certificate_id: req.body.certificate_id } })
    .catch((err) => res.json({ status: 500, data: { errorCode: "ISE" } }))
    .then(() => res.json({ status: 202 }));
};
