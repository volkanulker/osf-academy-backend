const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const crypto = require("crypto");
// Assertion style
chai.should();

chai.use(chaiHttp);

/**
 * Function to generate unique email
 * @param { int } length 
 * @returns 
 */
function generateUniqueEmail() {
    return  crypto.randomBytes(12).toString('hex');
}

describe("AUTH API", () => {
    // GET request tests
    describe("GET /auth", () => {
        // Test signin page
        it("It should render the signin page", (done) => {
            chai
            .request(server)
            .get("/auth/signin")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });

        // Test signup page
        it("It should render the signup page", (done) => {
            chai
            .request(server)
            .get("/auth/signup")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });

        // Test logout functionality
        it("It should logout", (done) => {
            chai
            .request(server)
            .get("/auth/logout")
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });
    })

    // POST request tests
    describe("POST /auth", () => {
        // Signup post test
        const newUser = {
            name:"testName",
            email:`${generateUniqueEmail()}@hotmail.com`,
            password:"12345"
        }
        it("It should CREATE a new User", (done) => {
            chai
            .request(server)
            .post("/auth/signup")
            .send(newUser)
            .end((error, response) => {
                response.should.have.status(201);
            });
            done();
        });

        // Signin post test
        const testUser = {
            email:'test123@hotmail.com',
            password:'test123'
        }
        it("It should signin", (done) => {
            chai
            .request(server)
            .post("/auth/signin")
            .send(testUser)
            .end((error, response) => {
                response.should.have.status(200);
            });
            done();
        });
        
    })
    
});