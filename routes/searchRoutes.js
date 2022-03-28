const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../requests/product");

router.get("/", (req, res) => {
    res.render("search/searchPage");
});

const filterProductsByName = (productName) => {
    getAllProducts((error, data) => {
        if (error) {
            return [];
        }

        const products = data;
        const filteredProducts = products.filter((p) => {
            return p.name.includes(productName);
        });

        return filteredProducts;
    });
};

router.post("/", (req, res) => {
    const productName = req.body.productName;
    getAllProducts((error, data) => {
        if (error) {
            return res.json({ data: [] });
        }
        if (data.error) {
            return res.json({ data: [] });
        }
        let filteredProducts = [];
        /* I have to use
        ** Big-O(n^2) algorithm because api does not support
        * searching all product by names we can only search products 
        page by page */

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
});

module.exports = router;
