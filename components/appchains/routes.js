const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const appchains = require('./appchain.controller');

router.post('/api/appchains', verifyKey, appchains.createAppchain);
router.delete('/api/appchains', verifyKey, appchains.deleteAppchain);

module.exports = router;