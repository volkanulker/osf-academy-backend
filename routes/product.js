var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('./product/productCard');
});

router.get('/product-detail', function(req, res, next) {
  res.render('product/productDetail')
} )



module.exports = router;
