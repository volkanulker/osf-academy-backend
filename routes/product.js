var express = require("express");
var router = express.Router();
const productRequest = require("../requests/product");

router.get("/:subCategory", function (req, res, next) {
  const subCategory = req.params.subCategory;

  productRequest.getProductByCategoryId(subCategory, (error, data) => {
    if (error) {
      return console.log(error);
    } else if (data.error) {
      return res.render('error')
    } else {
      let halfwayThrough = Math.ceil(data.length / 2);
      const productsOnLeft = data.slice(0, halfwayThrough);
      const productsOnRight = data.slice(halfwayThrough, data.length);

      res.render("./product/productCard", {
        productsOnLeft: productsOnLeft,
        productsOnRight: productsOnRight,
      });
    }
  });
});

router.get("/product-detail", function (req, res, next) {
  res.render("product/productDetail");
});

module.exports = router;
