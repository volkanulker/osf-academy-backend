const request = require("postman-request");
require("dotenv").config();
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase = `${process.env.API_BASE_URL}/cart`;

const secretKey = process.env.SECRET_KEY;

const errMessage = "Unable to connect to the Backend Service!";

/**
 * Function to make get cart request
 * @param { string } token 
 * @param { function } callback 
 */
module.exports.getCart = (token, callback) => {
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

/**
 * Function to make add item request
 * @param { string } token 
 * @param { string } productId 
 * @param { string } variantId 
 * @param { int } quantity 
 * @param { function } callback 
 */
module.exports.addItem = (token, productId, variantId, quantity, callback) => {
    const url = urlBase + "/addItem" + `?secretKey=${secretKey}`;

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
                productId: productId,
                variantId: variantId,
                quantity: quantity,
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
/**
 * Function to make remove item request
 * @param { string } token 
 * @param { string } productId 
 * @param { string } variantId 
 * @param { function } callback 
 */
module.exports.removeItem = (token, productId, variantId, callback) => {
    const url = urlBase + "/removeItem" + `?secretKey=${secretKey}`;
    request(
        {
            url: url,
            method: "DELETE",
            json: true,
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: {
                secretKey: `${secretKey}`,
                productId: productId,
                variantId: variantId,
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

/**
 * Function to make change item quantity request
 * @param { string } token 
 * @param { string } productId 
 * @param { string } variantId 
 * @param { int } quantity 
 * @param { function } callback 
 */
module.exports.changeItemQuantity = (
    token,
    productId,
    variantId,
    quantity,
    callback
) => {
    const url = urlBase + "/changeItemQuantity" + `?secretKey=${secretKey}`;
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
                productId: productId,
                variantId: variantId,
                quantity: quantity,
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
