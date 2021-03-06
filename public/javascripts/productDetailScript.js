let variationObj = {};
const errorMessageEl = document.getElementById("error-message");
const successMessageEl = document.getElementById("success-message");
/**
 * Function to add border to clicked variant value
 * @param { int } id
 * @param { string } className
 */
function addBorder(id, className) {
    var x = document.getElementsByClassName(className);
    for (i = 0; i < x.length; i++) {
        x.item(i).style.border = "none";
    }
    id.style.border = "2px solid black";
    let variationKey = id.getAttribute("variation-id");
    let variationValue = id.getAttribute("value");
    variationObj[`${variationKey}`] = variationValue;
}
/**
 * Function to add product to cart
 *
 */
async function addToCard() {
    errorMessageEl.textContent = "";
    successMessageEl.textContent = "";
    try {
        const res = await fetch("/product/get-variation-id", {
            method: "POST",
            body: JSON.stringify({ variationObj, productId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
            errorMessageEl.textContent = data.error;
        }

        if (data.variantId) {
            const quantity = 1;
            const variantId = data.variantId;
            const res = await fetch("/cart/add-item", {
                method: "POST",
                body: JSON.stringify({ productId, variantId, quantity }),
                headers: { "Content-Type": "application/json" },
            });

            const responseData = await res.json();

            if (responseData.error) {
                if (responseData.error === "Invalid Token") {
                    alert("Please login to your account first.");
                } else {
                    errorMessageEl.textContent = responseData.error;
                }
            }
            if (responseData.data) {
                alert("Product is added to the cart!");
            }

            window.location.reload();
        }
    } catch (err) {
        if (err.message === "productId is not defined") {
            errorMessageEl.textContent =
                "No variation found for this product, please try to add later.";
        } else {
            errorMessageEl.textContent = err;
        }
    }
}
/**
 * Function to add product to wishlist
 *
 */
async function addToWishlist() {
    errorMessageEl.textContent = "";
    successMessageEl.textContent = "";
    try {
        const res = await fetch("/product/get-variation-id", {
            method: "POST",
            body: JSON.stringify({ variationObj, productId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
            errorMessageEl.textContent = data.error;
        }

        if (data.variantId) {
            const quantity = 1;
            const variantId = data.variantId;
            const res = await fetch("/wishlist/add-item", {
                method: "POST",
                body: JSON.stringify({ productId, variantId, quantity }),
                headers: { "Content-Type": "application/json" },
            });

            const responseData = await res.json();

            if (responseData.error) {
                if (responseData.error === "Invalid Token") {
                    alert("Please login to your account first.");
                } else {
                    errorMessageEl.textContent = responseData.error;
                }
            }
            if (responseData.data) {
                alert("Product is added to the wishlist!");
            }

            window.location.reload();
        }
    } catch (err) {
        if (err.message === "productId is not defined") {
            errorMessageEl.textContent =
                "No variation found for this product, please try to add later.";
        } else {
            errorMessageEl.textContent = err;
        }
    }
}

/**
 * Function to buy product now
 */
async function buyNow() {
    let errorMessageEl = document.getElementById("error-message");
    errorMessageEl.textContent = "";
    try {
        const res = await fetch("/product/get-variation-id", {
            method: "POST",
            body: JSON.stringify({ variationObj, productId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
            errorMessageEl.textContent = data.error;
        }
        if (data.variantId) {
            fetch("/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: [
                        {
                            id: productId,
                            quantity: 1,
                            price,
                            name: productName,
                        },
                    ],
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    return res.json().then((json) => Promise.reject(json));
                })
                .then(({ url }) => {
                    window.location = url;
                })
                .catch((e) => {
                    errorMessageEl.textContent = e.error;
                });
        }
    } catch (e) {
        errorMessageEl.textContent = e.error;
    }
}
