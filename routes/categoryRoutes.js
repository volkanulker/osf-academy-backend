const express = require("express");
const router = express.Router();
const {
    getGenderCategorySelection,
    getSubcategorySelection,
} = require("../controllers/categoryController");

router.get(`/:gender`, getGenderCategorySelection);

router.get("/:gender/:parentCategoryName", getSubcategorySelection);

module.exports = router;
