const express = require("express");
const router = express.Router();
const cartRequets = require("../requests/cart.js");
const productRequets = require("../requests/product");

const getCartObject = (productData, cartItems, cartItemIndex) => {
  const name = productData[0].name;
  const description = productData[0].short_description;
  const price = productData[0].price;
  const variationValues = cartItems[cartItemIndex].variant.variation_values;
  const quantity = cartItems[cartItemIndex].quantity;
  const image = productData[0].image_groups[0].images[0];

  let cartObject = {
    name: name,
    description: description,
    price: price,
    variationValues: variationValues,
    quantity: quantity,
    image: image,
  };

  return cartObject;
};

router.get("/", (req, res) => {
  const token = req.cookies.jwt;
  let cartObjects = [];
  cartRequets.getCart(token, (cartError, cartData) => {
    if (cartError) {
      const errorToSend = {
        error: cartError,
      };
      return res.status(400).json(errorToSend);
    }
    if (cartData.error) {
      return res.status(400).json(data);
    }

    const cartItems = cartData.items;

    let cartItemIndex = 0;

    cartItems.forEach(async (item) => {
      let productId = item.productId;
      await new Promise((resolve, reject) => {
        productRequets.getProductById(productId, (productErr, productData) => {
          if (productData.error) {
            reject(productData.error);
          } else {
            let cartObject = getCartObject(
              productData,
              cartItems,
              cartItemIndex
            );
            resolve(cartObject);
          }
        });
      })
        .catch((err) => {
          res.render("error", {
            message: "An error is occured when fetching cart items.",
          });
        })
        .then((resolvedData) => {
          cartObjects.push(resolvedData);
        });
      return res.status(200).render("cart/cartPage", { cartObjects });
    });
  });
});

module.exports = router;
