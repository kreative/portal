const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const appchains = require('./appchain.controller');

// NEED TO ADD VERIFY KEY TO THESE ROUTES

router.post('/api/appchains', appchains.createAppchain);
router.delete('/api/appchains', appchains.deleteAppchain);

module.exports = router;