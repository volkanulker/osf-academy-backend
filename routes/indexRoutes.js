const express = require('express');
const router = express.Router();
const { getIndex, getHome } = require('../controllers/indexController')

router.get('/', getIndex)

router.get('/home', getHome)

module.exports = router;
