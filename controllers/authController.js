const { signin, signup } = require("../requests/auth");
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

module.exports.getSigninIndex = (req, res) => {
    res.status(200).render("auth/signin");
};

module.exports.getSignupIndex = (req, res) => {
    res.status(200).render("auth/signup");
};

module.exports.postSigninIndex = async (req, res) => {
    const { email, password } = req.body;

    signin(email, password, (error, data) => {
        if (error) {
            Sentry.captureException(error);
            return res.status(500).json({ error: error });
        }

        if (data.error) {
            return res.status(400).json(data);
        }

        if (data.user) {
            const { token } = data;
            const { user } = data;
            res.cookie("jwt", token, { httpOnly: true });
            res.cookie("email", user.email, { httpOnly: true });
            return res.status(200).json({ user: user._id, token: token });
        }
        Sentry.captureException(
            new Error("An internal error in signin post controller.")
        );
        return res
            .status(500)
            .json({ error: "An error is occured please try again later" });
    });
};

module.exports.postSignupIndex = (req, res) => {
    const { name, email, password } = req.body;

    signup(name, email, password, (error, data) => {
        if (error) {
            return res.status(500).json({ error: error });
        }

        if (data.error) {
            return res.status(400).json(data);
        }

        if (data.user) {
            const { token } = data;
            const { user } = data;
            res.cookie("jwt", token, { httpOnly: true });
            res.cookie("email", user.email, { httpOnly: true });
            return res.status(201).json({ user: user._id });
        }

        Sentry.captureException(
            new Error("An internal error in sign up post controller.")
        );
        return res
            .status(500)
            .json({ error: "An error is occured please try again later" });
    });
};

module.exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("email", "", { maxAge: 1 });
    res.status(200).redirect("/");
};
