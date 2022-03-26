module.exports.getProfilePageIndex = (req, res) => {
    const email = req.cookies.email;
    res.render("./profile/userProfile", {
        breadcrumbObjects: [],
        email: email,
    });
};
