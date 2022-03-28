const cartRequests = require("../requests/cart.js");
const productRequets = require("../requests/product");
const Sentry = require("@sentry/node");
const { getCartObject, getCartTotalPrice } = require('./controllerUtils/cartContollerUtils')

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";

module.exports.getCartIndex = async (req, res) => {
    const token = req.cookies.jwt;
    let cartObjects = [];
    cartRequests.getCart(token, async (cartError, cartData) => {
        if (cartError) {
            return res
                .status(500)
                .render("error", { message: apiErrorMessage });
        }

        if (cartData.error) {
            if (cartData.error === "There is no cart created for this user") {
                return res.status(200).render("cart/cartPage", { cartObjects });
            } else if (cartData.error === "Invalid Token") {
                return res
                    .status(401)
                    .render("error", { message: "Not authenticated." });
            } else {
                return res
                    .status(400)
                    .render("error", { message: cartData.error });
            }
        }

        const cartItems = cartData.items;
        let promises = [];

        cartItems.forEach(async (item, cartItemIndex) => {
            let productId = item.productId;

            promises.push(
                new Promise((resolve, reject) => {
                    productRequets.getProductById(
                        productId,
                        (productErr, productData) => {
                            if (productData.error) {
                                reject(productData.error);
                            } else {
                                let cartObject = getCartObject(
                                    productData,
                                    cartItems,
                                    cartItemIndex
                                );
                                resolve(cartObject);
                            }
                        }
                    );
                })
                    .catch((err) => {
                        Sentry.captureException(err);
                    })
                    .then((resolvedData) => {
                        cartObjects.push(resolvedData);
                    })
            );
        });

        await Promise.all(promises);

        let cartTotalPrice = getCartTotalPrice(cartObjects);
        
        return res
            .status(200)
            .render("cart/cartPage", { cartObjects, cartTotalPrice });
    });
};

module.exports.changeQuantity = (req, res) => {
    const token = req.cookies.jwt;
    const newQuantity = req.body.quantityValue;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    cartRequests.changeItemQuantity(
        token,
        productId,
        variantId,
        newQuantity,
        (error, data) => {
            if (error) {
                Sentry.captureException(error);
                return res.status(500).json({ error: apiErrorMessage });
            }
            if (data.error) {
                return res.status(400).json({ error: data.error });
            }

            return res.status(200).json({ data: data });
        }
    );
};

module.exports.removeItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    cartRequests.removeItem(token, productId, variantId, (error, data) => {
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

module.exports.addItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    const quantity = req.body.quantity;

    cartRequests.addItem(
        token,
        productId,
        variantId,
        quantity,
        (error, data) => {
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
        }
    );
};
