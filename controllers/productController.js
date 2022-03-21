const productRequest = require("../requests/product");
const breadcrumbUtils = require("../utils/breadcrumb");
const _ = require('lodash')

/*
 * Method to pop product id from pop
 * and push product name for understandable breadcrumb navs
 */
const getBreadcrumbNavs = (url, name) => {
    let paths = breadcrumbUtils.getBreadcrumbPaths(url);
    paths.pop();
    paths.push(name);
    return paths;
  };

module.exports.productPage_get = (req, res, next) => {
    const subCategory = req.params.subCategory;
    const pageNo = req.params.page
  
    productRequest.getProductByCategoryId(subCategory, pageNo, (error, data) => {
      if (error) {
        return res.render("error", { message: "An error occured" });
      }

      const url = req.url;
      const paths = breadcrumbUtils.getBreadcrumbPaths(url);
      
      const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(
        paths,
        "/product"
      );

      

      if (data.error) {
        return res.render("./product/productPage", {
          productsOnLeft:[],
          productsOnRight:[],
          breadcrumbObjects:[],
          curentPage: -1,
          numbOfProduct:0
        });
        //return res.render("error", { message: data.error });
      } else {
        let halfwayThrough = Math.ceil(data.length / 2);
        const productsOnLeft = data.slice(0, halfwayThrough);
        const productsOnRight = data.slice(halfwayThrough, data.length);
        const numbOfProduct = data.length
        const isThereNextPage = numbOfProduct < 25 ? false: true
        const isTherePrevPage = pageNo > 1 ? true : false
        console.log(breadcrumbObjects)
        return res.render("./product/productPage", {
          productsOnLeft,
          productsOnRight,
          breadcrumbObjects,
          currentPage: pageNo,
          isThereNextPage,
          isTherePrevPage
        });
      }
    });
  }

const getProductDetailObject = (productData) => {
    return (productDetailObj = {
      name: productData[0].name,
      description: productData[0].short_description,
      price: productData[0].price,
      currency: productData[0].currency,
      productImages: productData[0].image_groups[0].images,
      productId: productData[0].id,
      variationAttributesArr: productData[0].variation_attributes,
    });
  };

module.exports.productDetail_get =  (req, res, next) => {
    const productId = req.params.productId;
    productRequest.getProductById(productId, (error, data) => {
      if (error) {
        return res.render("error", { message: "An error occured" });
      }
      if (data.error) {
        return res.render("error", { message: data.error });
      }
  
      const {name, description, price, currency, productImages, productId, variationAttributesArr} = getProductDetailObject(data)
  
      const url = req.url;
      const paths = getBreadcrumbNavs(url, name);
      const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(
        paths,
        "/product"
      );
      return res.render("./product/productDetail", {
        productId,
        name,
        description,
        price,
        currency,
        productImages,
        variationAttributesArr,
        breadcrumbObjects,
      });
    });
  }

module.exports.getVariationId = (req, res) => {
    const variationObj = req.body.variationObj
    const productId = req.body.productId
    let isVariationFound = false
    productRequest.getProductById(productId, (error, data) => {
      if(error){
        return res.status(500).json({error: error})
      }
      if(data.error){
        return res.status(400).json({error:data.error})
      }
  
      const variants = data[0].variants
      console.log(variants)
      variants.forEach(variant => {
        let variationValues = variant.variation_values
        if( _.isEqual(variationValues,variationObj) ){
          isVariationFound = true
          return res.status(200).json({variantId:variant.product_id})
        }
      });
      if( !isVariationFound ){
        return res.status(400).json({error: 'Variation could not be found'})
      }
     
    })
  }






