const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured.";

module.exports.createCheckoutSession = async (req, res) => {
    const productsToBuy = req.body.items;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: productsToBuy.map((product) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity: product.quantity,
                };
            }),
            success_url: `${process.env.SERVER_URL}/payment/success`,
            cancel_url: `${process.env.SERVER_URL}/payment/cancel`,
        });
        res.status(200).json({ url: session.url });
    } catch (e) {
        Sentry.captureException(e)
        res.status(500).json({ error: e.message });
    }
};

module.exports.successPayment = (req, res) => {
    res.render("./payment/success");
};

module.exports.cancelPayment = (req, res) => {
    res.render("./payment/cancel");
};
