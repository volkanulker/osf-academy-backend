const { getOrders } = require("../requests/order");
const Sentry = require("@sentry/node");
const { getOrderCards } = require('./controllerUtils/orderControllerUtils')

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";

module.exports.getOrders = (req, res) => {
    const token = req.cookies.jwt;
    getOrders(token, async (error, data) => {
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
}






