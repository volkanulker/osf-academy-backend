var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/',(req, res, next) => {
      res.redirect('/home')
})


router.get('/home', (req, res, next) => {
      res.render('home')
})

  

module.exports = router;
