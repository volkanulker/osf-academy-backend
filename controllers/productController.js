const productRequest = require("../requests/product");
const breadcrumbUtils = require("../utils/breadcrumbUtils");
const _ = require("lodash");
const Sentry = require("@sentry/node");
const { getBreadcrumbNavs, getPaginationObject,getProductDetailObject } = require('./controllerUtils/productControllerUtils')

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

    productRequest.getProductByCategoryId(
        subCategory,
        pageNo,
        (error, data) => {
            if (error) {
                Sentry.captureException(error);
                return res
                    .status(500)
                    .render("error", { message: apiErrorMessage });
            }

            const url = req.url;
            const paths = breadcrumbUtils.getBreadcrumbPaths(url);

            const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(
                paths,
                "/product"
            );

            if (data.error) {
                return res.render("./product/productPage", {
                    productsOnLeft: [],
                    productsOnRight: [],
                    breadcrumbObjects: [],
                    curentPage: -1,
                    numbOfProduct: 0,
                });
            } else {
                let halfwayThrough = Math.ceil(data.length / 2);
                const productsOnLeft = data.slice(0, halfwayThrough);
                const productsOnRight = data.slice(halfwayThrough, data.length);
                const numbOfProduct = data.length;
                const currentPath = breadcrumbObjects[0].href;
                const paginationObj = getPaginationObject(
                    currentPath,
                    numbOfProduct,
                    pageNo
                );
                return res.render("./product/productPage", {
                    productsOnLeft,
                    productsOnRight,
                    breadcrumbObjects,
                    paginationObj,
                });
            }
        }
    );
};

module.exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    productRequest.getProductById(productId, (error, data) => {
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
};

module.exports.getVariationId = (req, res) => {
    const variationObj = req.body.variationObj;
    const productId = req.body.productId;
    let isVariationFound = false;

    productRequest.getProductById(productId, (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res.status(500).json({ error: apiErrorMessage });
        }
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        const variants = data[0].variants;
        variants.forEach((variant) => {
            let variationValues = variant.variation_values;
            if (_.isEqual(variationValues, variationObj)) {
                isVariationFound = true;
                return res.status(200).json({ variantId: variant.product_id });
            }
        });
        if (!isVariationFound) {
            return res
                .status(400)
                .json({ error: "Variation could not be found" });
        }
    });
};
