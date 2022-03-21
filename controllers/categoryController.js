const categoryRequest = require("../requests/category");
const breadcrumbUtils = require('../utils/breadcrumb')


module.exports.parentCategorySelection_get = (req, res, next) => {
    const gender = req.params.gender;
    if (gender === "mens" || gender === "womens") {
      categoryRequest.getAllParentCategories(gender, (error, data) => {
        if (error) {
          return res.render("error", { message: "An error occured." });
        }
        const url = req.url
        const paths = breadcrumbUtils.getBreadcrumbPaths(url)
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/category')
        return res.render("category/parentCategorySelection", {
          parentCategories: data,
          gender: gender,
          breadcrumbObjects
        });
      });
    } else {
      return res.render("error", { message: "Invalid gender" });
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
          return res.render("error", { message: "Category Not Found" });
        }
        if (error) {
          return res.render("error", { message: "An error occured." });
        }
        const url = req.url
        const paths = breadcrumbUtils.getBreadcrumbPaths(url)
        const breadcrumbObjects = breadcrumbUtils.getBreadcrumbObjects(paths,'/category')
        console.log(breadcrumbObjects)
        return res.render("category/subCategorySelection", {
          subCategories: data,
          gender: gender,
          breadcrumbObjects
        });
      }
    );
  }