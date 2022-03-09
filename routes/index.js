var express = require('express');
var router = express.Router();
var categoryRequest = require('../requests/category/category')
/* GET home page. */
router.get('/',(req, res, next) => {

  categoryRequest.getAllParentCategories('mens', (error, data) => {
    if(!error){
      res.render('index');
    }else {
      res.render('error', {message:'An error occured.'})
    }
  })

  
});

module.exports = router;
