const express = require("express");
const router = express.Router();
const {
    getWishlistIndex,
    addItem,
    removeItem,
} = require("../controllers/wishlistController");

router.get("/", getWishlistIndex);

router.post("/add-item", addItem);

router.delete("/remove-item", removeItem);

module.exports = router;
