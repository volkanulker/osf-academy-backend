const express = require("express");
const router = express.Router();
const productRequest = require("../requests/product");
const breadcrumbUtils = require('../utils/breadcrumb')

router.get("/:subCategory", function (req, res, next) {
  const subCategory = req.params.subCategory;

  productRequest.getProductByCategoryId(subCategory, (error, data) => {
    if (error) {
      return res.render('error', {message:'An error occured'})
    } 

    if (data.error) {
      return res.render('error', {message:data.error})
    } else {
      let halfwayThrough = Math.ceil(data.length / 2);
      const productsOnLeft = data.slice(0, halfwayThrough);
      const productsOnRight = data.slice(halfwayThrough, data.length);
      const url = req.url
      const paths = breadcrumbUtils.getBreadcrumbPaths(url)
      const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/product')
      return res.render("./product/productCard", {
        productsOnLeft, productsOnRight, breadcrumbObjects
      });
    }
  });
});

/*
* Method to pop product id from pop 
* and push product name for understandable breadcrumb navs
*/
const getBreadcrumbNavs = (url,name) => {
  let paths = breadcrumbUtils.getBreadcrumbPaths(url)
  paths.pop()
  paths.push(name)
  return paths
}

router.get("/:subCategory/:productId", function (req, res, next) {
  const productId = req.params.productId
  productRequest.getProductById(productId, (error, data) => {
    if (error) {
      return res.render('error', {message:'An error occured'})
    } 
    if(data.error){
      return res.render('error', {message:data.error})
    }

    const name = data[0].name
    const description = data[0].long_description
    const price = data[0].price
    const currency = data[0].currency
    const images = data[0].image_groups[0].images

    const url = req.url
    const paths = getBreadcrumbNavs(url, name)
    const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/product')
    return res.render('./product/productDetail', {name, description, price, currency, images, breadcrumbObjects})
    
  })

});

module.exports = router;
