const categoryRequest = require("../requests/category");
const breadcrumbUtils = require('../utils/breadcrumbUtils')
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const apiErrorMessage = "An API service error is occured."

module.exports.getGenderCategorySelection = (req, res, next) => {
    const gender = req.params.gender;
    if (gender === "mens" || gender === "womens") {
      categoryRequest.getAllParentCategories(gender, (error, data) => {
        if (error) {
          Sentry.captureException(error)
          return res.status(500).render("error", { message: apiErrorMessage });
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


  module.exports.getSubcategorySelection = (req, res, next) => {
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
          Sentry.captureException(error)
          return res.status(500).render("error", { message: apiErrorMessage });
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