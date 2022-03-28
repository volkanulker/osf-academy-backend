/**
 * Function to return name of a given product's variation value
 * @param { object } cartItem 
 * @param { object } productObj 
 * @returns { object}
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
 * Function to get wish object
 * @param { object[] } productData 
 * @param { object[] } wishItems 
 * @param { int } wishItemIndex 
 * @returns { object }
 */
const getWishObject = (productData, wishItems, wishItemIndex) => {
    const name = productData[0].name;
    const description = productData[0].short_description;
    const price = productData[0].price;
    const variationValues = getNameOfVariant(
        wishItems[wishItemIndex],
        productData[0]
    );
    const variantId = wishItems[wishItemIndex].variant.product_id;
    const productId = productData[0].id;
    const quantity = wishItems[wishItemIndex].quantity;
    const image = productData[0].image_groups[0].images[0];
    const productHref = `product/${productData[0].primary_category_id}/${productId}`;

    let wishObject = {
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

    return wishObject;
};


module.exports = {
    getWishObject
}
