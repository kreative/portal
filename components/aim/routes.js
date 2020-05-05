const express = require("express");
const router = express.Router();

const policies = require("./policies/policy.controller");
const certificates = require("./certificates/certificate.controller");

router.post("/api/policies", policies.createPolicy);
router.post("/api/policies/check", policies.checkIfPolicyExists);
router.put("/api/policies", policies.updatePolicy);
router.delete("/api/policies", policies.deletePolicy);

router.post("/api/certificates", certificates.createCertificate);
router.post("/api/certificates/verify", certificates.verifyCertificate);
router.delete("/api/certificates", certificates.deleteCertificate);

module.exports = router;