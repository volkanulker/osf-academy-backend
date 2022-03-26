const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    const email = req.cookies.email;
    res.render('./profile/userProfile', {breadcrumbObjects:[], email:email })
} );



module.exports = router;
