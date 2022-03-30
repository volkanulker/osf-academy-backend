const Sentry = require("@sentry/node");
const { getAllProducts } = require("../requests/product");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
});

module.exports.searchIndexGet = (req, res) => {
    res.render("search/searchPage");
}


module.exports.searchIndexPost =  (req, res) => {
    const productName = req.body.productName;
    getAllProducts((error, data) => {
        if (error) {
            Sentry.captureException(error)
            return res.json({ data: [] });
        }
        if (data.error) {
            return res.json({ data: [] });
        }
        let filteredProducts = [];

        /**  
        * I have to use
        * Big-O(n^2) algorithm because api does not support
        * searching all product by names we can only search products 
        * page by page 
        * */
        data.forEach((page) => {
            if (page !== undefined) {
                page.forEach((product) => {
                    if (product.name.toLowerCase().includes(productName)) {
                        filteredProducts.push(product);
                    }
                });
            }
        });
        return res.status(200).json({ data: filteredProducts });
    });
}