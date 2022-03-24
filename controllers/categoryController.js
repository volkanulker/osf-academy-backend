const categoryRequest = require("../requests/category");
const breadcrumbUtils = require('../utils/breadcrumbUtils')


module.exports.parentCategorySelection_get = (req, res, next) => {
    const gender = req.params.gender;
    if (gender === "mens" || gender === "womens") {
      categoryRequest.getAllParentCategories(gender, (error, data) => {
        if (error) {
          return res.status(500).render("error", { message: "An error occured." });
        }
        const url = req.url
        const paths = breadcrumbUtils.getBreadcrumbPaths(url)
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/category')
        return res.status(200).render("category/parentCategorySelection", {
          parentCategories: data,
          gender: gender,
          breadcrumbObjects
        });
      });
    } else {
      return res.status(404).render("error", { message: "Gender not found" });
    }
  }


  module.exports.subCategorySelection_get = (req, res, next) => {
    const gender = req.params.gender;
    const parentCategoryName = req.params.parentCategoryName;
  
    categoryRequest.getAllSubCategories(
      gender,
      parentCategoryName,
      (error, data) => {
        if (data.length === 0) {
          return res.status(404).render("error", { message: "Category Not Found" });
        }
        if (error) {
          return res.status(500).render("error", { message: "An error occured." });
        }
        const url = req.url
        const paths = breadcrumbUtils.getBreadcrumbPaths(url)
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/category')
        return res.status(200).render("category/subCategorySelection", {
          subCategories: data,
          gender: gender,
          breadcrumbObjects
        });
      }
    );
  }