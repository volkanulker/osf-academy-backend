const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartController')






router.get("/", cartController.cart_index );


router.post('/change-quantity', cartController.changeQuantity)


router.delete('/remove-item', cartController.removeItem)


router.post('/add-item', cartController.addItem )
module.exports = router;
