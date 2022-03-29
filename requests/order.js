const request = require("postman-request");
require("dotenv").config();

const Sentry = require("@sentry/node");
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase =`${process.env.API_BASE_URL}/orders`;
const secretKey = process.env.SECRET_KEY;
const errMessage = "Unable to connect to the Backend Service!";

module.exports.getOrders = (token, callback) => {
    const url = urlBase + `?secretKey=${secretKey}`;

    request(
        {
            url: url,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
        (error, response) => {
            if (error) {
                Sentry.captureException(error);
                callback(errMessage, undefined);
            } else {
                const data = response.body;
                callback(undefined, data);
            }
        }
    );
};

module.exports.createOrder = (token, paymentId, items, callback) => {
    const url = urlBase;
    const rndAddress = "an address"
    request(
        {
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: {
                secretKey: `${secretKey}`,
                paymentId: paymentId,
                items: items,
                address:rndAddress
            },
        },
        (error, response) => {
            if (error) {
                Sentry.captureException(error);
                callback(errMessage, undefined);
            } else {
                const data = response.body;
                callback(undefined, data);
            }
        }
    );
};
