const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
require("dotenv").config();
// Assertion style
chai.should();
chai.use(chaiHttp);

// test variables
const testUser = {
    email: "admin@hotmail.com",
    password: "admin123",
};

const testUser_2 = {
    email: "wishTester@hotmail.com",
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

let testToken_1 = "";
let testToken_2 = "";

describe("WISHLIST API", () => {
    describe("TEST /GET WISHLIST ", () => {
        it("It should render wishlist page", (done) => {
            // signin to user
            chai.request(server)
                .post("/auth/signin")
                .send(testUser_2)
                .end((error, response) => {
                    testToken_2 = response.body.token;
                    response.should.have.status(200);
                    // get wishlist
                    chai.request(server)
                        .get("/wishlist")
                        .set("Cookie", `jwt=${testToken_2}`)
                        .end((error, response) => {
                            response.should.have.status(200);
                        });
                });

            done();
        });
    });

    describe("TEST ALL /POST REQUESTS ", () => {
        it("It should add wish && delete wishlist item", (done) => {
            // signin and get token of user
            chai.request(server)
                .post("/auth/signin")
                .send(testUser)
                .end((error, response) => {
                    testToken_1 = response.body.token;
                    response.should.have.status(200);
                    // add item to the cart
                    chai.request(server)
                        .post(`/wishlist/add-item`)
                        .send(addItemBody)
                        .set("Cookie", `jwt=${testToken_1}`)
                        .end((error, response) => {
                            // remove item
                            response.should.have.status(200);
                            chai.request(server)
                                .delete(`/wishlist/remove-item`)
                                .send(deleteItemBody)
                                .set("Cookie", `jwt=${testToken_1}`)
                                .end((error, response) => {
                                    response.should.have.status(200);
                                });
                        });
                });

            done();
        });
    });
});
