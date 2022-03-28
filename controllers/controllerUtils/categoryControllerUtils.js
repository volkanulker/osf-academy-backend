const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

const { getCategoriesByParentId, getCategoryById } = require("../../requests/category");
/**
 * Function to get main category name and description
 * of given gender category
 * @param { string } gender 
 * @returns { object }
 */
module.exports.getMainCategoryData = async (gender) => {
    let mainCategoryData;
    await new Promise((resolve, reject) => {
        getCategoriesByParentId("root", (error, categoryData) => {
            if (error) {
                Sentry.captureException(error);
                reject(error);
                return;
            }
            const mainCategories = categoryData;
            mainCategories.forEach((category) => {
                if (category.id === gender) {
                    resolve(category);
                }
            });
        });
    }).then((categoryData) => {
        const { id, page_description } = categoryData;
        const name = id.toUpperCase();
        mainCategoryData = {
            name,
            page_description,
        };
    });
    return mainCategoryData;
};

/**
 * Function to get main category name and description
 * of given sub category
 * @param { string } gender 
 * @param { string } parentCategoryName 
 * @returns  { object }
 */
module.exports.getSubCategoryData = async (gender, parentCategoryName) => {
    let subCategoryData;
    const subCategoryId = gender + '-' + parentCategoryName.toLowerCase()
    await new Promise((resolve, reject) => {
        getCategoryById(subCategoryId, (error, categoryData) => {
            if (error) {
                reject(error)
                Sentry.captureException(error);
                return
            }
            resolve(categoryData)
        })
    }).then((categoryData) => {
        const { name, page_description } = categoryData;
        subCategoryData = {
            name,
            page_description,
        };
    });
    return subCategoryData;
};