module.exports.getIndex = (req, res, next) => {
    res.status(302).redirect("/home");
};

module.exports.getHome = (req, res, next) => {
    res.status(200).render("home", { breadcrumbObjects: null });
};
