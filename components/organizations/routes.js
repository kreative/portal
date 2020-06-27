const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const organizations = require("./organization.controller");

// router.get('/api/organizations', verifyKey, organizations.getOrganizations);
// router.post('/api/organizations', verifyKey, organizations.createOrganization);

router.get('/api/organizations', organizations.getOrganizations);
router.post('/api/organizations', organizations.createOrganization);

module.exports = router;