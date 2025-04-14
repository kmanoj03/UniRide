const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken.js");
const signup = require("../handlers/userAuth");
const login = require("../handlers/userAuth");
const logout = require("../handlers/userAuth");
const data = require("../handlers/userAuth");
const updateProfile = require("../handlers/userAuth.js");
const updateAccount = require("../handlers/userAuth.js");
const forgotPassword = require("../handlers/userAuth.js");
const verifyResetCode = require("../handlers/userAuth.js");
const resetPassword = require("../handlers/userAuth.js");

const { sendVerificationCode, verifyCode } = require("../handlers/verify.js");

router.post("/signup", signup.signupFunction);
router.post("/login", login.loginFunction);
router.post("/logout", logout.logoutFunction);
router.post("/data", data.getDataFunction);
// router.get("/userData/:username", data.getUserDataFunction);
router.post("/updateProfile", verifyToken, updateProfile.updateProfileFunction);
router.post("/updateAccount", verifyToken, updateAccount.updateAccountFunction);

router.post("/forgot-password", forgotPassword.forgotPasswordFunction);
router.post("/verify-reset-code", verifyResetCode.verifyResetCodeFunction);
router.post("/reset-password", resetPassword.resetPasswordFunction);

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);

module.exports = router;
