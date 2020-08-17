const express = require("express");
const router = express.Router();

const ssController = require("./sessions.controller");

router.get("/api/sessions", ssController.getAllSessions);
router.post("/api/sessions", ssController.postSession);

module.exports = router;