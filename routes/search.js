const express = require("express");
const router = express.Router();
const { getAllProducts } = require('../requests/product')


router.get('/', (req, res) => {
    res.render('search/searchPage')
})


const filterProductsByName = (productName) => {
    getAllProducts((error, data) => {
        if(error){
            return []
        }

        const products = data
        const filteredProducts = products.filter(p => {
            return p.name.includes(productName)
        })

        return filteredProducts
    })
}


router.post('/', (req, res) => {
    const productName = req.body.productName
    console.log('---------body----------')
    console.log(productName)
    console.log('---------body----------')

    getAllProducts((error, allProducts) => {
        if(error){
            return res.status(500).json({data:[]})
        }

        const filteredProducts = allProducts.filter(p => {
            console.log(p.name.toLowerCase() + "-" + productName.toLowerCase()+ "-" + p.name.toLowerCase().includes(productName.toLowerCase()))
            return p.name.toLowerCase().includes(productName.toLowerCase())
        })

        return res.status(201).json( {data:filteredProducts} )
    })
})


module.exports = router;