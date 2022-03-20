const express = require("express");
const router = express.Router();
const wishRequests = require("../requests/wishlist.js");
const productRequets = require("../requests/product");


/*
*  Function to return name of a given product's variation value
*/
const getNameOfVariant = (cartItem, productObj) => {
    const keys = Object.keys(cartItem.variant.variation_values)
    const variationAttributes = productObj.variation_attributes
    let variationObjWithNames = {}
    variationAttributes.forEach( attr => {
      keys.forEach(key => {
        if(attr.id === key){
          attr.values.forEach(valueObj => {
            if(cartItem.variant.variation_values[key] === valueObj.value){
              variationObjWithNames[key] = valueObj.name
            }
          })
  
        }
      })
      
    })
    return variationObjWithNames
  }
  

const getWishObject = (productData, cartItems, cartItemIndex) => {
    const name = productData[0].name;
    const description = productData[0].short_description;
    const price = productData[0].price;
    const variationValues = getNameOfVariant(cartItems[cartItemIndex], productData[0])
    const variantId = cartItems[cartItemIndex].variant.product_id
    const productId = productData[0].id
    const quantity = cartItems[cartItemIndex].quantity;
    const image = productData[0].image_groups[0].images[0];
    const productHref = `product/${productData[0].primary_category_id}/${productId}`
  
    let wishObject = {
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
  
    return wishObject;
  };
  
  

router.get("/", async(req, res) => {
    const token = req.cookies.jwt;
    let wishObjects = [];
    wishRequests.getWishlist(token, async (wishError, wishData) => {
      if (wishError) {
        return res.status(400).render('error', {message: wishError})
      }    
  
      if(wishData.error)
      {
        if (wishData.error==="There is no wishlist created for this user") {
          return res.status(200).render("wishlist/wishPage", { wishObjects });
        }
        else if(wishData.error === "Invalid Token"){
          return res.status(200).render('error', {message: 'Not authenticated.'})
        } else{
          return res.status(400).render('error', {message: wishData.error})
        }
        
      }
  
      const wishItems = wishData.items;
      let promises = []
  
      wishItems.forEach(async (item, wishItemIndex) => {
        let productId = item.productId;
        
        promises.push(
          new Promise((resolve, reject) => {
            productRequets.getProductById(productId, (productErr, productData) => {
              if (productData.error) {
                reject(productData.error);
              } else {
                
                let wishObject = getWishObject(
                  productData,
                  wishItems,
                  wishItemIndex
                );
                resolve(wishObject);
              }
            });
          })
            .catch((err) => {
                return res.status(500).render('error', {message: err})
            })
            .then((resolvedData) => {
                wishObjects.push(resolvedData);
            })
  
        )
          
      });
      
      await Promise.all(promises)
  
      
      return res.status(200).render("wishlist/wishPage", { wishObjects});
    });
    
  });
  
  
  router.post('/add-item', (req, res) => {
    const token = req.cookies.jwt; 
    const productId = req.body.productId
    const variantId = req.body.variantId
    const quantity = req.body.quantity
  
    wishRequests.addItem(token, productId, variantId, quantity, (error, data) => {
      if(error){
        return res.status(500).json({error: error})
      }
      if(data){
        if(data.error){
          return res.status(400).json({error: data.error})
        }
      }
  
      return res.status(200).json( {data: data} )
    })
    
  })



  router.delete('/remove-item', (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId
    const variantId = req.body.variantId
    wishRequests.removeItem(token, productId, variantId, (error, data) => {
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