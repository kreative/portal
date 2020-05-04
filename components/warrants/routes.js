const express = require("express");
const router = express.Router();

const verifyServiceKey = require("../../middleware/VerifyServiceKey");
const warrants = require("./warrant.controller");

router.get('/api/warrants/account', verifyServiceKey, warrants.getWarrantsForAccount);
router.get('/api/warrants/app', verifyServiceKey, warrants.getWarrantsForApp);
router.post('/api/warrants', verifyServiceKey, warrants.createWarrant);
router.post('/api/warrants/check', verifyServiceKey, warrants.checkForWarrant);
router.put('/api/warrants/deactivate', verifyServiceKey, warrants.deactivateWarrant);

module.exports = router;