const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController')

router.get("/:subCategory/page-:page", productController.productPage_get);




router.get("/:subCategory/:productId", productController.productDetail_get);


router.post('/get-variation-id',productController.getVariationId )

module.exports = router;
