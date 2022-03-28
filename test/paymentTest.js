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
const paymentTester = {
    email: "paymentTester@hotmail.com",
    password: "123",
};

const checkoutSessionBody = {
    items:[
        { id: "82936941", quantity: 1, price: 495, name: "Modern Blazer" }
    ]
}
    


let testToken_1 = "";

describe("PAYMENT API", () => {
    describe("TEST Create Checkout Session", () => {
        it("It should creates checkout session", (done) => {
            // signin and get token of user
            chai.request(server)
                .post("/auth/signin")
                .send(paymentTester)
                .end((error, response) => {
                    testToken_1 = response.body.token;
                    response.should.have.status(200)
                    chai.request(server)
                        .post(`/payment/create-checkout-session`)
                        .send(checkoutSessionBody)
                        .set("Cookie", `jwt=${testToken_1}`)
                        .end((error, response) => {
                            response.should.have.status(200)
                        });
                });

            done();
        });
    });

    describe("TEST /GET cancel payment", () => {
        it("It should render cancel payment page", (done) => {
            chai
            .request(server)
            .get("/payment/cancel")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });
    });
});
