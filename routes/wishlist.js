const express = require("express");
const router = express.Router();
const wishlistController = require('../controllers/wishlistController')

router.get("/", wishlistController.wishlist_index);
  
router.post('/add-item', wishlistController.addItem)

router.delete('/remove-item', wishlistController.removeItem)

module.exports = router;