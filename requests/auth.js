const request = require("postman-request");
require("dotenv").config();

const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const urlBase = `${process.env.API_BASE_URL}/auth`;

const secretKey = process.env.SECRET_KEY;

const errMessage = "Unable to connect to the Backend Service!";

module.exports.signup = (name, email, password, callback) => {
    const url = urlBase + "/signup";

    request(
        {
            url: url,
            json: true,
            method: "POST",
            headers: { "content-type": "application/json" },
            body: {
                secretKey: secretKey,
                name: name,
                email: email,
                password: password,
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

module.exports.signin = (email, password, callback) => {
    const url = urlBase + "/signin";

    request(
        {
            url: url,
            json: true,
            method: "POST",
            headers: { "content-type": "application/json" },
            body: {
                secretKey: secretKey,
                email: email,
                password: password,
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

module.exports.getToken = (email, password, callback) => {
    const url = urlBase + "/signin";

    request(
        {
            url: url,
            json: true,
            method: "POST",
            headers: { "content-type": "application/json" },
            body: {
                secretKey: secretKey,
                email: email,
                password: password,
            },
        },
        (error, response) => {
            if (error) {
                Sentry.captureException(error);
                callback(errMessage, undefined);
            } else {
                const data = response.body;
                const { token } = data;
                callback(undefined, { token: token });
            }
        }
    );
};
