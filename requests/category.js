const request = require("postman-request");
require("dotenv").config();

const Sentry = require("@sentry/node");
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase = `${process.env.API_BASE_URL}/categories`;
const secretKey = process.env.SECRET_KEY;
const errMessage = "Unable to connect to the Backend Service!";

/**
 * Function to make get request for get all categories
 * @param { function } callback 
 */
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

/**
 * Function to make get request for get categories by id
 * @param { string } id 
 * @param { function } callback 
 */
module.exports.getCategoriesByParentId = (id, callback) => {
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
/**
 * Function to make get request for get category by id
 * @param { string } categoryId 
 * @param { function } callback 
 */
module.exports.getCategoryById = (categoryId, callback) => {
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
/**
 * Function to make get request for getting all parent categories
 * @param { string } gender 
 * @param { function } callback 
 */
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
/**
 * Function to make get request for getting all sub categories
 * @param { string } gender 
 * @param { string } parentCategoryName 
 * @param { function } callback 
 */
module.exports.getAllSubCategories = (gender, parentCategoryName, callback) => {
    this.getCategoriesByParentId(
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
