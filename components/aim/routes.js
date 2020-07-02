const express = require("express");
const router = express.Router();

const certificates = require("./certificates/certificate.controller");

router.post("/api/certificates", certificates.createCertificate);
router.post("/api/certificates/verify", certificates.verifyCertificate);
router.delete("/api/certificates", certificates.deleteCertificate);

module.exports = router;