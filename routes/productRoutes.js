const express = require("express");
const router = express.Router();
const {
    getProductList,
    getProductDetails,
    getVariationId,
} = require("../controllers/productController");

router.get("/:subCategory", getProductList);

router.get("/:subCategory/:productId", getProductDetails);

router.post("/get-variation-id", getVariationId);

module.exports = router;
