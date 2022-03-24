const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

// Assertion style
chai.should();
chai.use(chaiHttp);

describe("Index page requests", () => {
    // GET request tests
    describe("GET /", () => {
        // Test home page
        it("It should redirected to home page", (done) => {
            chai
            .request(server)
            .get("/")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });

    })

    describe("GET /home", () => {
        // Test home page
        it("It should render the home page", (done) => {
            chai
            .request(server)
            .get("/home")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });

    })
 
});