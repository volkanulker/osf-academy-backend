const request = require("request");
require("dotenv").config();

const Sentry = require("@sentry/node");
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase =
    "https://osf-digital-backend-academy.herokuapp.com/api/categories";
const secretKey = process.env.SECRET_KEY;
const errMessage = "Unable to connect to the Backend Service!";

const getAllCategories = (callback) => {
    const url = urlBase + `?secretKey=${secretKey}`;

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

const getCategoriesByParentId = (id, callback) => {
    const path = `/parent/${id}`;
    const url = urlBase + path + `?secretKey=${secretKey}`;

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

const getCategoryById = (categoryId, callback) => {
    const path = `/${categoryId}`;
    const url = urlBase + path + `?secretKey=${secretKey}`;

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

module.exports.getAllParentCategories = (gender, callback) => {
    getAllCategories((error, data) => {
        if (error) {
            Sentry.captureException(error);
            callback(errMessage, undefined);
        } else {
            const allCategories = data;
            const parentCategoryObjects = allCategories.filter(
                (category) => category["parent_category_id"] === gender
            );

            callback(undefined, parentCategoryObjects);
        }
    });
};

module.exports.getAllSubCategories = (gender, parentCategoryName, callback) => {
    getCategoriesByParentId(
        gender + "-" + parentCategoryName.toLowerCase(),
        (error, data) => {
            if (error) {
                Sentry.captureException(error);
                return callback(errMessage, undefined);
            }
            return callback(undefined, data);
        }
    );
};
