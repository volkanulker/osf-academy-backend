const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

// Assertion style
chai.should();
chai.use(chaiHttp);

const testUser = {
    email: "orderTester@hotmail.com",
    password: "123"
}

let testToken_1 = "";
describe("Order Requests", () => {
    // GET request tests
    describe("GET /", () => {
        // Test get orders
        it("It should get orders", (done) => {
            // signin to user
            chai.request(server)
                .post("/auth/signin")
                .send(testUser)
                .end((error, response) => {
                    testToken_1 = response.body.token;
                    response.should.have.status(200);
                    // get orders
                    chai.request(server)
                        .get("/order")
                        .set("Cookie", `jwt=${testToken_1}`)
                        .end((error, response) => {
                            response.should.have.status(200);
                        });
                    
                });
            done();
        });

    })

});