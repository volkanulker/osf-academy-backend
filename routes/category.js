const express = require('express');
const router = express.Router();
const categoryRequest = require('../requests/category')

router.get(`/:gender`,(req, res, next) => {
    const gender = req.params.gender
    if(gender === 'mens' || gender === 'womens'){
      categoryRequest.getAllParentCategories(gender, (error, data) => {
        if(!error){
          return res.render('category/parentCategorySelection', {parentCategories:data, gender:gender});
        }else {
          return res.render('error', {message:'An error occured.'})
        }
      })
    } else{
      return res.render('error', {message:'Invalid gender'})
    }
  
  
    
})

router.get('/:gender/:parentCategoryName', (req,res,next) => {
  const gender = req.params.gender
  const parentCategoryName = req.params.parentCategoryName

  categoryRequest.getAllSubCategories(gender,parentCategoryName,(error, data) => {
    if(data.length === 0 ){
      return res.render('error', {message:'Category Not Found'})
    }
    if(error){
      return res.render('error', {message:'An error occured.'})
    } else {
      return res.render('category/subCategorySelection', {subCategories:data, gender:gender, })
    }
  })

})



module.exports = router