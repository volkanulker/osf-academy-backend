/**
 * 
 * @param { object } cartItem 
 * @param { object } productObj 
 * @returns { object }
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


/**
 * 
 * @param  { object[] } productData 
 * @param { object[] } cartItems 
 * @param { int } cartItemIndex 
 * @returns { object }
 */
const getCartObject = (productData, cartItems, cartItemIndex) => {
    const name = productData[0].name;
    const description = productData[0].short_description;
    const price = productData[0].price;
    const variationValues = getNameOfVariant(
        cartItems[cartItemIndex],
        productData[0]
    );
    const variantId = cartItems[cartItemIndex].variant.product_id;
    const variantPrice = cartItems[cartItemIndex].variant.price;
    const productId = productData[0].id;
    const quantity = cartItems[cartItemIndex].quantity;
    const image = productData[0].image_groups[0].images[0];
    const productHref = `product/${productData[0].primary_category_id}/${productId}`;

    let cartObject = {
        name,
        description,
        price,
        variationValues,
        quantity,
        image,
        variantId,
        productId,
        productHref,
        variantPrice
    };

    return cartObject;
};
/**
 * Function to get total price of cart objects
 * @param {object[]} cartObjects 
 * @returns { int }
 */

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

module.exports = {
    getCartObject,
    getCartTotalPrice
}