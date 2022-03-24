const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

router.get('/', indexController.index_get)

router.get('/home', indexController.home_get)

module.exports = router;
