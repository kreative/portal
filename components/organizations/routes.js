const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const organizations = require("./organization.controller");

// NEED TO ADD VERIFYKEY TO ALL ROUTES EVENTUALLY

router.get('/api/organizations', organizations.getOrganizations);
router.post('/api/organizations', organizations.createOrganization);
router.delete('/api/organizations/:oidn', organizations.removeOrganization);

module.exports = router;