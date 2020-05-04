const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const permits = require("./permit.controller");

router.get('/api/permits/dev', verifyKey, permits.getPermitsForDev);
router.get('/api/permits/app', verifyKey, permits.getPermitsForDev);
router.post('/api/permits', verifyKey, permits.createPermit);
router.put('/api/permits', verifyKey, permits.updatePermit);
router.put('/api/permits/deactivate', verifyKey, permits.deactivatePermit);
router.delete('/api/permits', verifyKey, permits.deletePermit);

module.exports = router;