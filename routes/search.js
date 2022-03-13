const express = require("express");
const router = express.Router();












router.get('/', (req, res) => {
    res.render('search/searchPage')
})









module.exports = router;