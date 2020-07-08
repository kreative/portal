const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const permits = require("./permit.controller");

// need to add verifyKey eventually
router.get('/api/permits', permits.getPermits);
router.post('/api/permits', permits.createPermit);
router.put('/api/permits/:permit_id', permits.updatePermit);
router.put('/api/permits/deactivate/:permit_id', permits.deactivatePermit);
router.put('/api/permits/activate/:permit_id', permits.activatePermit);
router.delete('/api/permits/:permit_id', permits.deletePermit);

module.exports = router;