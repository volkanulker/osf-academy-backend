async function deleteItem(elementRef) {
    const parentClassEl = elementRef.closest(".wish-card");
    const productId = parentClassEl.getAttribute("product-id");
    const successMessageEl = document.getElementById(
        `success-message-${productId}`
    );
    const errorMessageEl = document.getElementById(
        `error-message-${productId}`
    );
    const variantId = parentClassEl.getAttribute("variant-id");

    successMessageEl.textContent = "";
    errorMessageEl.textContent = "";
    try {
        const res = await fetch("/wishlist/remove-item", {
            method: "DELETE",
            body: JSON.stringify({ productId, variantId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data) {
            if (data.error) {
                errorMessageEl.textContent = data.error;
            }
        }

        parentClassEl.remove();
        window.location.reload();
    } catch (err) {
        errorMessageEl.textContent = err;
    }
}

async function addToCard(elementRef) {
    const parentClassEl = elementRef.closest(".wish-card");
    const productId = parentClassEl.getAttribute("product-id");
    const successMessageEl = document.getElementById(
        `success-message-${productId}`
    );
    const errorMessageEl = document.getElementById(
        `error-message-${productId}`
    );
    const variantId = parentClassEl.getAttribute("variant-id");

    successMessageEl.textContent = "";
    errorMessageEl.textContent = "";
    try {
        const quantity = 1;
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
    } catch (err) {
        errorMessageEl.textContent = err;
    }
}
