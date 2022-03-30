const breadcrumbUtils = require("../../utils/breadcrumbUtils");
const { getCategoryById } = require('../../requests/category')

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


/**
 * Function to get main category name and description
 * of given parent category
 * @param { string } parentCategoryId
 * @returns  { object }
 */
getMainCategoryData = async (parentCategoryId) => {
    let parentCategoryData;
    await new Promise((resolve, reject) => {
        getCategoryById(parentCategoryId, (error, categoryData) => {
            if (error) {
                reject(error)
                Sentry.captureException(error);
                return
            }
            resolve(categoryData)
        })
    }).then((categoryData) => {
        const { name, page_description } = categoryData;
        parentCategoryData = {
            name,
            page_description,
        };
    });
    return parentCategoryData;
};

/**
 * Function to remove the query string from last path element
 * @param { string[] } paths 
 * @returns { string[] }
 */
 const getPathsWithoutQuery = (paths) => {
    const lastElement = paths.pop()
    const pathWithoutQuery = lastElement.split('?')[0]
    paths.push(pathWithoutQuery)
    return paths
}

/**
 * Function to split product array
 * to print on two bootstrap column
 * @param { object[] } products 
 * @returns { object } 
 */
 const getSplittedProducts = (products) => {
    let halfwayThrough = Math.ceil(products.length / 2);
    const productsOnLeft = products.slice(0, halfwayThrough);
    const productsOnRight = products.slice(halfwayThrough, products.length);
    return {
        productsOnLeft,
        productsOnRight,
    };
};


/**
 * Function to check whether variation is found or not
 * @param { object[] } variants 
 * @param { object } variationObj 
 * @returns { boolean } isVariationFound
 */
 const checkIfVariationFound = (variants, variationObj) => {
    let isVariationFound = false;
    variants.forEach((variant) => {
        let variationValues = variant.variation_values;
        if (_.isEqual(variationValues, variationObj)) {
            isVariationFound = true;
        }
    });
    return isVariationFound;
};


/**
 * Function to get variant id of a variation
 * @param { object[] } variants 
 * @param { object } variationObj 
 * @returns { int } variantId
 */
 const getVariantId = (variants, variationObj) => {
    let variantId;
    variants.forEach((variant) => {
        let variationValues = variant.variation_values;
        if (_.isEqual(variationValues, variationObj)) {
            variantId = variant.product_id;
        }
    });
    return variantId;
};


module.exports = {
    getBreadcrumbNavs,
    getPaginationObject,
    getProductDetailObject,
    getMainCategoryData,
    getPathsWithoutQuery,
    getSplittedProducts,
    checkIfVariationFound,
    getVariantId
    
}