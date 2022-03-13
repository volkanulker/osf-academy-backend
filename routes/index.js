const express = require('express');
const router = express.Router();
const breadcrumbUtils = require('../utils/breadcrumb')


/* GET home page. */
router.get('/',(req, res, next) => {
      res.redirect('/home')
})


router.get('/home', (req, res, next) => {
      
      res.render('home', {breadcrumbObjects:null})
})

  

module.exports = router;
