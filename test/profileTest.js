const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");


// Assertion style
chai.should();
chai.use(chaiHttp);

describe("PROFILE API", () => {
    describe("GET /profile", () => {
        // Test product detail page
        it("It should render profile page", (done) => {
            chai.request(server)
                .get("/profile")
                .end((error, response) => {
                    response.should.have.status(200);
                });
            done();
        });
    });
});
