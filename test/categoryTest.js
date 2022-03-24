const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Category API", () => {
  /**
   * Test the GET category
   */
  describe("GET /category", () => {
    // Test the womens category
    it("It should get all the mens parent categories", (done) => {
      chai
        .request(server)
        .get("/category/mens")
        .end((error, response) => {
          response.should.have.status(200);
        });
      done();
    });

    // Test the mens category
    it("It should get all the womens parent categories", (done) => {
      chai
        .request(server)
        .get("/category/womens")
        .end((error, response) => {
          response.should.have.status(200);
        });
      done();
    });

    // Test an invalid category
    it("It should not get a category and should returns 404", (done) => {
        chai
          .request(server)
          .get('/category/randomThing')
          .end((error, response) => {
            response.should.have.status(404);
          });
        done();
      });

    // Test the mens subcategory
    it("It should get mens clothing subcategories", (done) => {
        chai
          .request(server)
          .get("/category/mens/Clothing")
          .end((error, response) => {
            response.should.have.status(200);
          });
        done();
      });

      // Test the mens subcategory with invalid input
    it("Invalid subcategory name entered it should return 404", (done) => {
        chai
          .request(server)
          .get("/category/mens/invalidInp")
          .end((error, response) => {
            response.should.have.status(404);
          });
        done();
      });

      // Test the womens subcategory
    it("It should get women's jewelry subcategories", (done) => {
        chai
          .request(server)
          .get("/category/womens/Jewelry")
          .end((error, response) => {
            response.should.have.status(200);
          });
        done();
      });


      // Test the womens subcategory with invalid input
    it("Invalid subcategory name entered it should return 404", (done) => {
        chai
          .request(server)
          .get("/category/womens/invalidInp")
          .end((error, response) => {
            response.should.have.status(404);
          });
        done();
      });
  });
});
