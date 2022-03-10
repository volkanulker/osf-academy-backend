var express = require('express');
var router = express.Router();
var categoryRequest = require('../requests/category/category')

/* GET home page. */
router.get('/',(req, res, next) => {
      res.redirect('/home')
})


router.get('/home', (req, res, next) => {
      res.render('home')
})

  

module.exports = router;
