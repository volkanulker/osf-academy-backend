const express = require("express");
const router = express.Router();
const cartRequests = require("../requests/cart.js");
const productRequets = require("../requests/product");

const getCartObject = (productData, cartItems, cartItemIndex) => {
  const name = productData[0].name;
  const description = productData[0].short_description;
  const price = productData[0].price;
  const variationValues = cartItems[cartItemIndex].variant.variation_values;
  const variantId = cartItems[cartItemIndex].variant.product_id
  const productId = productData[0].id
  const quantity = cartItems[cartItemIndex].quantity;
  const image = productData[0].image_groups[0].images[0];
  const productHref = `product/${productData[0].primary_category_id}/${productId}`

  let cartObject = {
    name: name,
    description: description,
    price: price,
    variationValues: variationValues,
    quantity: quantity,
    image: image,
    variantId: variantId,
    productId:productId,
    productHref:productHref
  };

  return cartObject;
};

router.get("/", (req, res) => {
  const token = req.cookies.jwt;
  let cartObjects = [];
  cartRequests.getCart(token, (cartError, cartData) => {
    if (cartError) {
      const errorToSend = {
        error: cartError,
      };
      return res.status(400).json(errorToSend);
    }
    if (cartData.error==="There is no cart created for this user") {
      return res.status(200).render("cart/cartPage", { cartObjects });
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
          res.status(400).json({error:err});
        })
        .then((resolvedData) => {
          cartObjects.push(resolvedData);
        });
      return res.status(200).render("cart/cartPage", { cartObjects });
    });
  });
});


router.post('/change-quantity',(req, res) => {
    const token = req.cookies.jwt;
    const newQuantity = req.body.quantityValue
    const productId = req.body.productId
    const variantId = req.body.variantId
    cartRequests.changeItemQuantity(token, productId,variantId,newQuantity, (error, data) => {
        if(error){
            return res.status(400).json({error:'API service error'})
        }
        if(data.error){
            return res.status(400).json({error:data.error})
        }

        return res.status(200).json({data:data})
    })
} )


router.delete('/remove-item', (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId
    const variantId = req.body.variantId
    cartRequests.removeItem(token, productId, variantId, (error, data) => {
        if(error){
            return res.status(400).json({error:'API service error'})
        }
        if(data){
          if(data.error){
            return res.status(400).json({error: data.error})
          }
        }
        return res.status(200).json({data:data})
    })
})

module.exports = router;
