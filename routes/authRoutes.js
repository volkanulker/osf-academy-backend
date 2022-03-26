const express = require("express");
const router = express.Router();
const {
    getSigninIndex,
    getSignupIndex,
    postSigninIndex,
    postSignupIndex,
    logout,
} = require("../controllers/authController");

router.get("/signin", getSigninIndex);

router.get("/signup", getSignupIndex);

router.post("/signin", postSigninIndex);

router.post("/signup", postSignupIndex);

router.get("/logout", logout);

module.exports = router;
