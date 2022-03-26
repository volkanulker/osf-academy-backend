const request = require("request");
require("dotenv").config();

const Sentry = require("@sentry/node");
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase = `${process.env.API_BASE_URL}/products/product_search`;
const secretKey = process.env.SECRET_KEY;
const errMessage = "Unable to connect to the Backend Service!";

module.exports.getProductById = (id, callback) => {
    const url = `${urlBase}?id=${id}&secretKey=${secretKey}`;

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            Sentry.captureException(error);
            callback(errMessage, undefined);
        } else {
            const data = response.body;
            callback(undefined, data);
        }
    });
};

const getProductsByPage = (pageNo, callback) => {
    let url = `${urlBase}?page=${pageNo}&secretKey=${secretKey}`;
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            Sentry.captureException(error);
            return callback(errMessage, undefined);
        } else {
            const data = response.body;
            callback(undefined, data);
        }
    });
};
/*
 * Make request to api one by one to find total number of page
 * in the api dynamically if no data.error returned by the url
 * catch error and stop while loop then get promise array
 */
module.exports.getAllProducts = async (callback) => {
    var productArr = [];
    let pageNo = 1;
    let isAllPageSearched = false;
    while (!isAllPageSearched) {
        await new Promise((resolve, reject) => {
            getProductsByPage(pageNo, (error, data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        })
            .catch((errorMessage) => {
                isAllPageSearched = true;
                Sentry.captureException(new Error(errorMessage));
            })
            .then((d) => {
                productArr.push(d);
            });

        pageNo += 1;
    }
    callback(undefined, productArr);
};

module.exports.getProductByCategoryId = (id, pageNo, callback) => {
    const url = `${urlBase}?primary_category_id=${id}&page=${pageNo}&secretKey=${secretKey}`;

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            Sentry.captureException(error);
            callback(errMessage, undefined);
        } else {
            const data = response.body;
            callback(undefined, data);
        }
    });
};
