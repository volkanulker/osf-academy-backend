const express = require("express");
const router = express.Router();
const orderRequests = require("../requests/order");
const productRequests = require("../requests/product");
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";

// Method to get product object with product name and product image
const getProductObj = (productId, quantity, price) => {
    return new Promise((resolve, reject) => {
        productRequests.getProductById(productId, (error, data) => {
            if (error) {
                Sentry.captureException(error);
                reject(error.message);
            } else {
                const { name } = data[0];
                let imageLink = data[0].image_groups[0].images[0].link;

                let productObj = {
                    name,
                    imageLink,
                    quantity,
                    price,
                };

                resolve(productObj);
            }
        });
    });
};
// method to get order cards
const getOrderCards = async (orderArr) => {
    let promises = [];
    let orderCards = [];
    orderArr.forEach((order) => {
        let orderProducts = [];
        order.items.forEach((orderItem) => {
            let productId = orderItem.productId;
            let quantity = orderItem.quantity;
            let price = orderItem.variant.price;
            promises.push(
                new Promise((resolve, reject) => {
                    getProductObj(productId, quantity, price).then(
                        (productObj) => {
                            resolve(productObj);
                        }
                    );
                }).then((productObj) => {
                    orderProducts.push(productObj);
                })
            );
        });

        let orderCard = {
            orderProducts,
            id: order._id,
        };
        orderCards.push(orderCard);
    });

    await Promise.all(promises);
    return orderCards;
};

router.get("/", (req, res) => {
    const token = req.cookies.jwt;
    orderRequests.getOrders(token, async (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res
                .status(500)
                .render("error", { message: apiErrorMessage });
        }

        if (data.error) {
            if (data.error === "Invalid Token") {
                return res
                    .status(401)
                    .render("error", { message: "Please login first." });
            } else if (data.error === "There are no orders for this user") {
                return res
                    .status(200)
                    .render("./order/orderDetails", { orderCards: [] });
            } else {
                Sentry.captureException(new Error(data.error));
                return res.status(400).render("error", { message: data.error });
            }
        }

        const orderCards = await getOrderCards(data);
        return res.status(200).render("./order/orderDetails", { orderCards });
    });
});

router.post("/", (req, res) => {
    res.send("Post order page");
});

module.exports = router;
