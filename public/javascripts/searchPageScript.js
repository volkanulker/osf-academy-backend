/**
 * Needed variables
 */
const form = document.querySelector("form");
const spinnerEl = document.getElementById("spinner");
const searchResultsEl = document.getElementById("searchResults");
const searchResultCards = searchResultsEl.children;
const messageEl = document.getElementById("message");
let showMoreResultsBtnEl = document.getElementById("show-more-results-btn");

let productStartIndex = 0;
let productOffset = 25;
let save = 0;
/**
 * Function to add element to cart
 * from search page
 * @param {HTML Element} elementRef
 */
async function addToCart(elementRef) {
    const resultCardEl = elementRef.closest(".result-card");
    const productId = resultCardEl.getAttribute("product-id");
    const variantId = resultCardEl.getAttribute("variant-id");

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
                alert(responseData.error);
            }
        }
        if (responseData.data) {
            alert("Product is added to the cart!");
        }
    } catch (err) {
        alert("An error occured when adding item to the cart");
    }
}

/**
 * Function to add element to wishlist
 * from search page
 * @param {HTML Element} elementRef
 */
async function addToWishlist(elementRef) {
    const resultCardEl = elementRef.closest(".result-card");
    const productId = resultCardEl.getAttribute("product-id");
    const variantId = resultCardEl.getAttribute("variant-id");

    try {
        const quantity = 1;
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
                alert(responseData.error);
            }
        }
        if (responseData.data) {
            alert("Product is added to the wishlist!");
        }
    } catch (err) {
        alert("An error occured please try again later.");
    }
}

/**
 * More results functions
 */

/**
 * Function to print more results when more results button clicked
 */
function showMoreResults() {
    save = productStartIndex;
    for (let index = productStartIndex; index < save + productOffset; index++) {
        if (searchResultCards.item(index)) {
            let productCardEl = searchResultCards.item(index);
            productCardEl.classList.remove("hide");
            productStartIndex += 1;
        } else {
            showMoreResultsBtnEl.classList.add("invisible");
        }
    }
}

// Function to get number of item displayed on the screen
/**
 *
 * @param { object[] } productArr
 * @returns { int } length
 */
function getNumberOfItemToDisplay(productArr) {
    if (productArr.length > 25) {
        return 25;
    }
    return productArr.length;
}

/**
 * Function print items which comes first from payload
 * @param { int } numberOfItemToDisplay
 */
function printFirstItems(numberOfItemToDisplay) {
    for (let index = 0; index < numberOfItemToDisplay; index++) {
        let productCardEl = searchResultCards.item(index);
        productCardEl.classList.remove("hide");
    }
}

/**
 * get search results when
 * search button clicked
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // get document elements an variables
    const productName = form.productname.value;

    // clear message and results searches
    messageEl.textContent = "";
    searchResultsEl.innerHTML = "";

    // check product name with regex
    let match = productName.match(/^[a-zA-Z]*/);
    let match2 = productName.match(/\s*/);

    if (match2[0] === productName) {
        messageEl.textContent = "No product found by this name";
        return;
    }
    if (match[0] === productName) {
        try {
            // show spinner div
            spinnerEl.classList.add("busy");
            // wait for response
            const res = await fetch("/search", {
                method: "POST",
                body: JSON.stringify({ productName }),
                headers: { "Content-Type": "application/json" },
            });
            // get payload
            const payload = await res.json();
            spinnerEl.classList.remove("busy");

            const productArr = payload.data;

            // show more results button
            // if payload has more than 25 product
            if (productArr.length > 25) {
                showMoreResultsBtnEl.classList.remove("invisible");
            }

            // check length of payload
            if (productArr.length === 0) {
                messageEl.textContent = "No product found by this name";
            } else {
                // print products filtered products to screen
                productArr.forEach((product) => {
                    if (!(typeof product.variants[0] === "undefined")) {
                        let productCard = `
                            <div class="result-card hide" product-id="${product.id}" variant-id="${product.variants[0].product_id}">
                                <div class="card mb-3 mt-3" style="max-width: 540px">
                                    <div class="row no-gutters">
                                    <div class="col-md-4">
                                        <img
                                        src="/images/${product.image_groups[0].images[0].link}"
                                        class="card-img"
                                        alt="${product.image_groups[0].images[0].alt}"
                                        />
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body d-flex flex-column">
                                            <h5 class="card-title">${product.name}</h5>
                                            <p class="card-text">
                                                ${product.short_description}
                                                <br>
                                                <p class="text-muted"><b>Type:</b> ${product.primary_category_id}</p>
                                                <p class="text-muted"><b>Price:</b> ${product.price} ${product.currency} </p>
                                            </p>
                                        </div>
                                        <div class="card-footer bg-transparent border-dark mt-auto">
                                            <div class="row">
                                            <div class="col-6">
                                                <button class="btn btn-warning add-btn" onclick="addToCart(this)"><i class="fa-solid fa-cart-plus fa-2x"></i></button>
                                            </div>
                                            <div class="col-6">
                                                <button class="btn btn-danger add-btn" onclick="addToWishlist(this)"><i class="fa-solid fa-heart fa-2x"></i></button>
                                            </div>

                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>`;
                        searchResultsEl.innerHTML += productCard;
                    }
                });
                let numberOfItemToDisplay =
                    getNumberOfItemToDisplay(productArr);
                printFirstItems(numberOfItemToDisplay);
            }
        } catch (err) {
            console.log(err);
            messageEl.textContent =
                "An error occured while searching products please try again later.";
        }
    } else {
        messageEl.textContent = "No product found by this name";
    }
});
