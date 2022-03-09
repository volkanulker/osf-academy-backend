var express = require('express');
var router = express.Router();
var categoryRequest = require('../requests/category/category')

router.get(`/:gender/parent-category-selection`,(req, res, next) => {
    const gender = req.params.gender
    categoryRequest.getAllParentCategories(gender, (error, data) => {
      if(!error){
        res.render('category/parentCategorySelection', {parentCategories:data});
      }else {
        res.render('error', {message:'An error occured.'})
      }
    })
  
    
  })

module.exports = router