const cartRequests = require("../requests/cart.js");
const productRequets = require("../requests/product");

/*
 *  Function to return name of a given product's variation value
 */
const getNameOfVariant = (cartItem, productObj) => {
    const keys = Object.keys(cartItem.variant.variation_values);
    const variationAttributes = productObj.variation_attributes;
    let variationObjWithNames = {};
    variationAttributes.forEach((attr) => {
        keys.forEach((key) => {
            if (attr.id === key) {
                attr.values.forEach((valueObj) => {
                    if (
                        cartItem.variant.variation_values[key] ===
                        valueObj.value
                    ) {
                        variationObjWithNames[key] = valueObj.name;
                    }
                });
            }
        });
    });
    return variationObjWithNames;
};

const getCartObject = (productData, cartItems, cartItemIndex) => {
    const name = productData[0].name;
    const description = productData[0].short_description;
    const price = productData[0].price;
    const variationValues = getNameOfVariant(
        cartItems[cartItemIndex],
        productData[0]
    );
    const variantId = cartItems[cartItemIndex].variant.product_id;
    const productId = productData[0].id;
    const quantity = cartItems[cartItemIndex].quantity;
    const image = productData[0].image_groups[0].images[0];
    const productHref = `product/${productData[0].primary_category_id}/${productId}`;

    let cartObject = {
        name: name,
        description: description,
        price: price,
        variationValues: variationValues,
        quantity: quantity,
        image: image,
        variantId: variantId,
        productId: productId,
        productHref: productHref,
    };

    return cartObject;
};

const getCartTotalPrice = (cartObjects) => {
    if (cartObjects === undefined) {
        return 0;
    }

    let total = 0;
    cartObjects.forEach((c) => {
        total += c.price * c.quantity;
    });

    return total;
};

module.exports.cart_index = async (req, res) => {
    const token = req.cookies.jwt;
    let cartObjects = [];
    cartRequests.getCart(token, async (cartError, cartData) => {
        if (cartError) {
            return res.status(400).render("error", { message: cartError });
        }

        if (cartData.error) {
            if (cartData.error === "There is no cart created for this user") {
                return res.status(200).render("cart/cartPage", { cartObjects });
            } else if (cartData.error === "Invalid Token") {
                return res
                    .status(401)
                    .render("error", { message: "Not authenticated." });
            } else {
                return res
                    .status(400)
                    .render("error", { message: cartData.error });
            }
        }

        const cartItems = cartData.items;
        let promises = [];

        cartItems.forEach(async (item, cartItemIndex) => {
            let productId = item.productId;

            promises.push(
                new Promise((resolve, reject) => {
                    productRequets.getProductById(
                        productId,
                        (productErr, productData) => {
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
                        }
                    );
                })
                    .catch((err) => {})
                    .then((resolvedData) => {
                        cartObjects.push(resolvedData);
                    })
            );
        });

        await Promise.all(promises);

        let cartTotalPrice = getCartTotalPrice(cartObjects);
        return res
            .status(200)
            .render("cart/cartPage", { cartObjects, cartTotalPrice });
    });
};

module.exports.changeQuantity = (req, res) => {
    const token = req.cookies.jwt;
    const newQuantity = req.body.quantityValue;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    cartRequests.changeItemQuantity(
        token,
        productId,
        variantId,
        newQuantity,
        (error, data) => {
            if (error) {
                return res.status(400).json({ error: "API service error" });
            }
            if (data.error) {
                console.log(data.error);
                return res.status(400).json({ error: data.error });
            }

            return res.status(200).json({ data: data });
        }
    );
};

module.exports.removeItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    cartRequests.removeItem(token, productId, variantId, (error, data) => {
        if (error) {
            return res.status(400).json({ error: "API service error" });
        }
        if (data) {
            if (data.error) {
                console.log(data.error);
                return res.status(400).json({ error: data.error });
            }
        }
        return res.status(200).json({ data: data });
    });
};

module.exports.addItem = (req, res) => {
    const token = req.cookies.jwt;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    const quantity = req.body.quantity;

    cartRequests.addItem(
        token,
        productId,
        variantId,
        quantity,
        (error, data) => {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (data) {
                if (data.error) {
                    console.log(data.error);
                    return res.status(400).json({ error: data.error });
                }
            }
            console.log("test");
            return res.status(200).json({ data: data });
        }
    );
};
