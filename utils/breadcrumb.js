/*
 * method to get breadcrumb path components as an array
 */
module.exports.getBreadcrumbPaths = (url) => {
  const currentUrl = url;
  const splittedUrlArr = currentUrl.split("/");
  splittedUrlArr.shift();
  return splittedUrlArr;
};

/*
 * method to get breadcrumb objects  as an array
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
