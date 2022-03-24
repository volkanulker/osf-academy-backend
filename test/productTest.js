const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

// Assertion style
chai.should();
chai.use(chaiHttp);

// Test variables
const variationObj = { color: "BDA", size: "42" };
const productId = "82936941";

describe("PRODUCT API", () => {
    describe("GET /product", () => {
        // Test product detail page
        it("It should render the product detail page", (done) => {
            chai.request(server)
                .get("/product/mens-clothing-jackets/34736758")
                .end((error, response) => {
                    response.should.have.status(200);
                });
            done();
        });
        // Test product list page
        it("It should render the product list ", (done) => {
            chai.request(server)
                .get("/product/mens-clothing-jackets")
                .end((error, response) => {
                    response.should.have.status(200);
                });
            done();
        });

        // Test get variation
        it("It should get variation id of given variation object ", (done) => {
            chai.request(server)
                .get("/product/get-variation-id")
                .send(variationObj, productId)
                .end((error, response) => {
                    response.should.have.status(200);
                });
            done();
        });
    });
});
