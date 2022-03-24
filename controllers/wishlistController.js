const wishRequests = require("../requests/wishlist.js");
const productRequets = require("../requests/product");
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";

/*
 *  Function to return name of a given product's variation value
 */
const getNameOfVariant = (cartItem, productObj) => {
    const keys = Object.keys(cartItem.variant.variation_values);
    const variationAttributes = productObj.variation_attributes;
    let variationObjWithNames = {};
    variationAttributes.forEach((attr) => {
        keys.forEach((key) => {
            if (attr.id === key) {
                attr.values.forEach((valueObj) => {
                    if (
                        cartItem.variant.variation_values[key] === valueObj.value
                    ) {
                        variationObjWithNames[key] = valueObj.name;
                    }
                });
            }
        });
    });
    return variationObjWithNames;
};

const getWishObject = (productData, wishItems, wishItemIndex) => {
    const name = productData[0].name;
    const description = productData[0].short_description;
    const price = productData[0].price;
    const variationValues = getNameOfVariant(
        wishItems[wishItemIndex],
        productData[0]
    );
    const variantId = wishItems[wishItemIndex].variant.product_id;
    const productId = productData[0].id;
    const quantity = wishItems[wishItemIndex].quantity;
    const image = productData[0].image_groups[0].images[0];
    const productHref = `product/${productData[0].primary_category_id}/${productId}`;

    let wishObject = {
        name: name,
        description: description,
        price: price,
        variationValues: variationValues,
        quantity: quantity,
        image: image,
        variantId: variantId,
        productId: productId,
        productHref: productHref,
    };

    return wishObject;
};

module.exports.wishlist_index = async (req, res) => {
    const token = req.cookies.jwt;
    let wishObjects = [];
    wishRequests.getWishlist(token, async (wishError, wishData) => {
        if (wishError) {
            Sentry.captureException(wishError);
            return res
                .status(500)
                .render("error", { message: apiErrorMessage });
        }

        if (wishData.error) {
            if (wishData.error === "There is no wishlist created for this user") {
                return res
                    .status(200)
                    .render("wishlist/wishPage", { wishObjects });
            } else if (wishData.error === "Invalid Token") {
                return res
                    .status(401)
                    .render("error", { message: "Not authenticated." });
            } else {
                return res
                    .status(400)
                    .render("error", { message: wishData.error });
            }
        }

        const wishItems = wishData.items;
        let promises = [];

        wishItems.forEach(async (item, wishItemIndex) => {
            let productId = item.productId;

            promises.push(
                new Promise((resolve, reject) => {
                    productRequets.getProductById(
                        productId,
                        (productErr, productData) => {
                            if (productData.error) {
                                Sentry.captureException(new Error(productData.error))
                                reject(productData.error);
                            } else {
                                let wishObject = getWishObject(
                                    productData,
                                    wishItems,
                                    wishItemIndex
                                );
                                resolve(wishObject);
                            }
                        }
                    );
                })
                    .catch((err) => {
                        Sentry.captureException(err);
                        return res
                            .status(500)
                            .render("error", { message: err });
                    })
                    .then((resolvedData) => {
                        wishObjects.push(resolvedData);
                    })
            );
        });

        await Promise.all(promises);

        return res.status(200).render("wishlist/wishPage", { wishObjects });
    });
};

module.exports.addItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    const quantity = req.body.quantity;

    wishRequests.addItem(
        token,
        productId,
        variantId,
        quantity,
        (error, data) => {
            if (error) {
                Sentry.captureException(error);
                return res.status(500).json({ error: error });
            }
            if (data) {
                if (data.error) {
                    return res.status(400).json({ error: data.error });
                }
            }

            return res.status(200).json({ data: data });
        }
    );
};

module.exports.removeItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    wishRequests.removeItem(token, productId, variantId, (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res.status(500).json({ error: apiErrorMessage });
        }
        if (data) {
            if (data.error) {
                return res.status(400).json({ error: data.error });
            }
        }
        return res.status(200).json({ data: data });
    });
};
