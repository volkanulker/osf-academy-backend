/**
 * Function to get breadcrumb paths
 * @param { string } url 
 * @returns { string[] }
 */
module.exports.getBreadcrumbPaths = (url) => {
  const currentUrl = url;
  const splittedUrlArr = currentUrl.split("/");
  splittedUrlArr.shift();
  return splittedUrlArr;
};


/**
 * Function to get breadcrumb objects  as an array
 * @param { string[] } pathArray 
 * @param { string } base 
 * @returns { object[] }
 */
module.exports.getBreadcrumbObjects = (pathArray, base) => {
  const breadcrumbObjects = [];
  pathArray.forEach((path) => {
    base = base + "/" + path;
    let bcObj = {
      path: path,
      href: base,
    };
    breadcrumbObjects.push(bcObj);
  });

  return breadcrumbObjects;
};
