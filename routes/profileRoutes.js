const express = require("express");
const router = express.Router();
const { getProfilePageIndex } = require('../controllers/profileController')

router.get("/", getProfilePageIndex);



module.exports = router;
