const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
require("dotenv").config();
// Assertion style
chai.should();
chai.use(chaiHttp);

/**
 * Testing variables
 */
const testUser = {
    email: "admin@hotmail.com",
    password: "admin123",
};

const testUser_2 = {
    email: "cartTester@hotmail.com",
    password: "123",
};

const deleteItemBody = {
    productId: "21736758",
    variantId: "883360541280",
};

const addItemBody = {
    productId: "21736758",
    variantId: "883360541280",
    quantity: "2",
};

const changeQuantityBody = {
    quantityValue: "2",
    productId: "21736758",
    variantId: "883360541280",
};

let testToken_1 = "";
let testToken_2 = "";

describe("CART API", () => {
    describe("TEST GET CART", () => {
        it("It should render cart page", (done) => {
            // signin and get token of user
            chai.request(server)
                .post("/auth/signin")
                .send(testUser_2)
                .end((error, response) => {
                    testToken_2 = response.body.token;
                    // test get cart
                    chai.request(server)
                        .get("/cart")
                        .set("Cookie", `jwt=${testToken_2}`)
                        .end((error, response) => {
                            response.should.have.status(200);
                        });
                });

            done();
        });
    });

    describe("TEST ALL POST REQUESTS ", () => {
        it("It should signin user && add && change quantity && delete cart item", (done) => {
            // signin and get token of user
            chai.request(server)
                .post("/auth/signin")
                .send(testUser)
                .end((error, response) => {
                    testToken_1 = response.body.token;
                    response.should.have.status(200);
                    // add item to the cart
                    chai.request(server)
                        .post(`/cart/add-item`)
                        .send(addItemBody)
                        .set("Cookie", `jwt=${testToken_1}`)
                        .end((error, response) => {
                            // change quantity of item
                            chai.request(server)
                                .post("/cart/change-quantity")
                                .send(changeQuantityBody)
                                .set("Cookie", `jwt=${testToken_1}`)
                                .end((error, response) => {
                                    // delete item from the cart
                                    response.should.have.status(200);
                                    chai.request(server)
                                        .delete(`/cart/remove-item`)
                                        .send(deleteItemBody)
                                        .set("Cookie", `jwt=${testToken_1}`)
                                        .end((error, response) => {
                                            response.should.have.status(200);
                                        });
                                });
                        });
                });

            done();
        });
    });
});
