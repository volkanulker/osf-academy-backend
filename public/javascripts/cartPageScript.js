/**
 * Function to decrease quantity of clicked element
 * @param { HTML element} elementRef 
 */
async function decreaseQuantity(elementRef) {
    const quantityEl = elementRef.parentNode.querySelector(".quantity");
    let quantityValue = parseInt(quantityEl.getAttribute("value"));

    const parentClassEl = quantityEl.closest(".cart-card");
    const productId = parentClassEl.getAttribute("product-id");
    const variantId = parentClassEl.getAttribute("variant-id");

    if (quantityValue > 1) {
        quantityValue -= 1;
        quantityEl.setAttribute("value", quantityValue);

        try {
            const res = await fetch("/cart/change-quantity", {
                method: "POST",
                body: JSON.stringify({ quantityValue, productId, variantId }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.error) {
            }
            window.location.reload();
        } catch (err) {
            messageEl.textContent = err;
        }
    }
}

/**
 * Function to increase quantity of clicked element
 * @param { HTML element} elementRef 
 */
async function increaseQuantity(elementRef) {
    const quantityEl = elementRef.parentNode.querySelector(".quantity");
    let quantityValue = parseInt(quantityEl.getAttribute("value"));
    const parentClassEl = quantityEl.closest(".cart-card");
    const productId = parentClassEl.getAttribute("product-id");
    const variantId = parentClassEl.getAttribute("variant-id");

    quantityValue += 1;
    quantityEl.setAttribute("value", quantityValue);

    try {
        const res = await fetch("/cart/change-quantity", {
            method: "POST",
            body: JSON.stringify({ quantityValue, productId, variantId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
        }
        window.location.reload();
    } catch (err) {
        messageEl.textContent = err;
    }
}
/**
 * Function to delete clicked element
 * @param { HTML element} elementRef 
 */
async function deleteItem(elementRef) {
    let numbOfItemEl = document.getElementById("numb-of-items");
    let numbOfItemValue = parseInt(numbOfItemEl.textContent);

    numbOfItemValue -= 1;
    numbOfItemEl.textContent = numbOfItemValue + " items";

    const parentClassEl = elementRef.closest(".cart-card");
    const productId = parentClassEl.getAttribute("product-id");
    const messageEl = document.getElementById("info-message");
    const variantId = parentClassEl.getAttribute("variant-id");

    messageEl.textContent = "";

    try {
        const res = await fetch("/cart/remove-item", {
            method: "DELETE",
            body: JSON.stringify({ productId, variantId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data) {
            if (data.error) {
                messageEl.textContent = data.error;
            }
        }

        parentClassEl.remove();
        window.location.reload();
    } catch (err) {
        messageEl.textContent = error;
    }
}


/**
 * Function of buy now button
 */
 function buyNow() {
    let errorMessageEl = document.getElementById("error-message");
    errorMessageEl.textContent = "";
    if (cartObjects.length > 0) {
        fetch("/payment/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: cartObjects.map((cartObj) => {
                    return {
                        id: cartObj.productId,
                        quantity: cartObj.quantity,
                        price: cartObj.price,
                        name: cartObj.name,
                    };
                }),
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
    } else {
        errorMessageEl.textContent = "There is no item to buy.";
    }
}