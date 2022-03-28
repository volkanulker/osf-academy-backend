const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
require("dotenv").config();

// Assertion style
chai.should();
chai.use(chaiHttp);


describe("SEARCH API", () => {
    describe("TEST /GET Search ", () => {
        // get Search Page
        it("It should render the search page", (done) => {
            chai
            .request(server)
            .get("/search")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });
    });

    describe("TEST /POST Search ", () => {
        // search for a product test
        it("It should search for a product", (done) => {
            chai
            .request(server)
            .post("/search")
            .send('cotton')
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });
    });

});
