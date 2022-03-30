const express = require("express");
const router = express.Router();
const { searchIndexGet, searchIndexPost } = require('../controllers/searchController')

router.get("/", searchIndexGet );

router.post("/", searchIndexPost );

module.exports = router;
