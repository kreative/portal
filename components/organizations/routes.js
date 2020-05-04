const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const organizations = require("./organization.controller");

router.post('/api/organizations', verifyKey, organizations.createOrganization);

module.exports = router;