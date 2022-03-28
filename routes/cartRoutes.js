const express = require("express");
const router = express.Router();
const {
    getCartIndex,
    changeQuantity,
    removeItem,
    addItem,
} = require("../controllers/cartController");

router.get("/", getCartIndex);

router.post("/change-quantity", changeQuantity);

router.delete("/remove-item", removeItem);

router.post("/add-item", addItem);

module.exports = router;
