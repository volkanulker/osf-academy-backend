let variationObj = {};
const errorMessageEl = document.getElementById("error-message");
const successMessageEl = document.getElementById("success-message");

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
                successMessageEl.textContent = "Product is added to the cart!";
            }

            window.location.reload();
        }
    } catch (err) {
        errorMessageEl.textContent = err;
    }
}

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
                successMessageEl.textContent =
                    "Product is added to the wishlist!";
            }

            window.location.reload();
        }
    } catch (err) {
        errorMessageEl.textContent = err;
    }
}
