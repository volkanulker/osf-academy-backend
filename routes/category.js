const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController')

router.get(`/:gender`, categoryController.parentCategorySelection_get);

router.get("/:gender/:parentCategoryName", categoryController.subCategorySelection_get);


module.exports = router;
