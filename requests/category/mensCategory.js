const request = require("request");
const category = require("./category");

const urlBase =
  "https://osf-digital-backend-academy.herokuapp.com/api/categories";

const secretKey =
  "$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS";

const errMessage = "Unable to connect to the Backend Service!";

const getAllParentCategories = (callback) => {

  category.getAllCategories((error, data) => {
    if (error) {
      callback(error, undefined);
    } else {
      const allCategories = data;
      const parentCategoryObjects = allCategories.filter(
        (category) => category["parent_category_id"] === "mens"
      );

      let parentCategoryNames = [];
      parentCategoryObjects.forEach((categoryObject) => {
        parentCategoryNames.push(categoryObject.name);
      });

      callback(undefined, parentCategoryNames);
    }
  });
  
};

//getParentCategories()

// categoryUtil.getCategoryById('mens-clothing-jackets', (error, data) => {

//     if(error){
//         return console.log(error)
//     } else{
//         return console.log(data)
//     }
// })

module.exports = {
  getAllParentCategories: getAllParentCategories,
};
