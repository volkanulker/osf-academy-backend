const {
    getProductByCategoryId,
    getProductById,
} = require("../requests/product");
const breadcrumbUtils = require("../utils/breadcrumbUtils");
const _ = require("lodash");
const Sentry = require("@sentry/node");
const {
    getBreadcrumbNavs,
    getPaginationObject,
    getProductDetailObject,
    getMainCategoryData,
    getPathsWithoutQuery,
    getSplittedProducts,
    checkIfVariationFound,
    getVariantId
} = require("./controllerUtils/productControllerUtils");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";



module.exports.getProductList = (req, res, next) => {
    const subCategory = req.params.subCategory;
    let pageNo = req.query.page;
    pageNo === undefined ? (pageNo = 1) : pageNo;

    getProductByCategoryId(subCategory, pageNo, async (error, products) => {
        if (error) {
            Sentry.captureException(error);
            return res
                .status(500)
                .render("error", { message: apiErrorMessage });
        }

        const mainCategoryData = await getMainCategoryData(subCategory);
        const url = req.url;
        const paths = breadcrumbUtils.getBreadcrumbPaths(url);
        const pathsWithoutQuery = getPathsWithoutQuery(paths);
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(
            pathsWithoutQuery,
            "/product"
        );

        if (products.error) {
            return res.render("./product/productList", {
                mainCategoryData,
                productsOnLeft: [],
                productsOnRight: [],
                breadcrumbObjects: [],
                curentPage: -1,
                numbOfProduct: 0,
            });
        } else {

            let { productsOnLeft, productsOnRight } = getSplittedProducts(products);
                
            const numbOfProducts = products.length;
            const currentPath = breadcrumbObjects[0].href;
            const paginationObj = getPaginationObject(
                currentPath,
                numbOfProducts,
                pageNo
            );
            return res.render("./product/productList", {
                mainCategoryData,
                productsOnLeft,
                productsOnRight,
                breadcrumbObjects,
                paginationObj,
            });
        }
    });
};

module.exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    getProductById(productId, (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res
                .status(500)
                .render("error", { message: apiErrorMessage });
        }
        if (data.error) {
            return res.render("error", { message: data.error });
        }

        const {
            name,
            description,
            price,
            currency,
            productImages,
            productId,
            variationAttributesArr,
        } = getProductDetailObject(data);

        const url = req.url;
        const paths = getBreadcrumbNavs(url, name);
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(
            paths,
            "/product"
        );

        return res.render("./product/productDetail/productDetailPage", {
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
};




module.exports.getVariationId = (req, res) => {
    const variationObj = req.body.variationObj;
    const productId = req.body.productId;
    let isVariationFound;
    // check whether variant available 
    if (_.isEmpty(variationObj)) {
        return res.status(400).json({
            error: "Please select a variation.",
        });
    }

    getProductById(productId, (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res.status(500).json({ error: apiErrorMessage });
        }
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        const variants = data[0].variants;
        
        isVariationFound = checkIfVariationFound(variants, variationObj);
        if (isVariationFound) { // check whether variation found
            const variantId = getVariantId(variants, variationObj);
            return res.status(200).json({ variantId });
        }

        if (!isVariationFound) {
            return res.status(400).json({
                error: "Sorry, that variation is not in stock right now",
            });
        }
    });
};
