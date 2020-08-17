const express = require("express");
const router = express.Router();
const sessions = require("./sessions.controller");

router.get("/api/sessions", sessions.getSessions);
router.post("/api/sessions", sessions.createSession);

module.exports = router;