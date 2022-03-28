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
