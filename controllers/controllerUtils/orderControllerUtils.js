const productRequests = require("../../requests/product");
/**
 * Function to get product object with product name and product image
 * @param { int } productId 
 * @param { int } quantity 
 * @param { int } price 
 * @returns { Promise }
 */
const getProductObj = (productId, quantity, price) => {
    return new Promise((resolve, reject) => {
        productRequests.getProductById(productId, (error, data) => {
            if (error) {
                Sentry.captureException(error);
                reject(error.message);
            } else {
                const { name } = data[0];
                let imageLink = data[0].image_groups[0].images[0].link;

                let productObj = {
                    name,
                    imageLink,
                    quantity,
                    price,
                };

                resolve(productObj);
            }
        });
    });
};

/**
 * Function to get order cards
 * @param { object[] } orderArr 
 * @returns { object[] }
 */
const getOrderCards = async (orderArr) => {
    let promises = [];
    let orderCards = [];
    orderArr.forEach((order) => {
        let orderProducts = [];
        order.items.forEach((orderItem) => {
            let productId = orderItem.productId;
            let quantity = orderItem.quantity;
            let price = orderItem.variant.price;
            promises.push(
                new Promise((resolve, reject) => {
                    getProductObj(productId, quantity, price).then(
                        (productObj) => {
                            resolve(productObj);
                        }
                    );
                }).then((productObj) => {
                    orderProducts.push(productObj);
                })
            );
        });

        let orderCard = {
            orderProducts,
            id: order._id,
        };
        orderCards.push(orderCard);
    });

    await Promise.all(promises);
    return orderCards;
};

module.exports = {
    getProductObj,
    getOrderCards
}