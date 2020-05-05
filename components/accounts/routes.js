const express = require("express");
const router = express.Router();

const verifyKey = require("../../middleware/VerifyKeyMiddleware");
const validateRedirectData = require("../../middleware/ValidateRedirectData");
const accounts = require("./account.controller");

router.get('/login', validateRedirectData, accounts.getLoginPage);
router.get('/signup', validateRedirectData, accounts.getSignupPage);
router.get('/resetpassword', validateRedirectData, accounts.getResetPasswordPage);
router.get('/findusername', validateRedirectData, accounts.getFindUsernamePage);
router.get('/verifyemail', accounts.getVerifyEmailPage);
router.post('/api/check', accounts.checkIfCredExists);
router.post('/api/convertemail', accounts.convertEmailToUsername);
router.post('/api/accounts/signup', accounts.signup);
router.post('/api/accounts/login', accounts.login);
router.post('/api/accounts/logout', verifyKey, accounts.logout);
router.post('/api/accounts/verify', accounts.verifyKey);
router.post('/api/accounts/resetcode', accounts.requestPasswordResetCode);
router.post('/api/accounts/resetcode/verify', accounts.verifyResetCode);
router.post('/api/accounts/resetpassword', accounts.resetPassword);
router.post('/api/accounts/verifyemail', accounts.verifyEmail);

module.exports = router;