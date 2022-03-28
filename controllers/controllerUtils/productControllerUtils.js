const breadcrumbUtils = require("../../utils/breadcrumbUtils");

/**
 * Function to pop product id from pop
 * and push product name for understandable breadcrumb navs
 * @param { string } url 
 * @param { string } name 
 * @returns { string[] }
 */
const getBreadcrumbNavs = (url, name) => {
    let paths = breadcrumbUtils.getBreadcrumbPaths(url);
    paths.pop();
    paths.push(name);
    return paths;
};


/**
 * Function get Pagination object 
 * @param { string } currentPath 
 * @param { int } numbOfProduct 
 * @param { int } pageNo 
 * @returns { object }
 */
const getPaginationObject = (currentPath, numbOfProduct, pageNo) => {
    const isThereNextPage = numbOfProduct < 25 ? false : true;
    const isTherePrevPage = pageNo > 1 ? true : false;
    const nextPageHref =
        currentPath.split("?")[0] + `?page=${parseInt(pageNo) + 1}`;
    const prevPageHref =
        currentPath.split("?")[0] + `?page=${parseInt(pageNo) - 1}`;

    return (paginationObj = {
        pageNo,
        isThereNextPage,
        isTherePrevPage,
        nextPageHref,
        prevPageHref,
    });
};



/**
 * Function to get product detail object
 * @param { object[] } productData 
 * @returns { object }
 */
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

module.exports = {
    getBreadcrumbNavs,
    getPaginationObject,
    getProductDetailObject
}