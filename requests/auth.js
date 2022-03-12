const request = require("request");

const urlBase =
  "https://osf-digital-backend-academy.herokuapp.com/api/auth";


const secretKey =
  "$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS";

const errMessage = "Unable to connect to the Backend Service!";

const signup = (name, email, password, callback) => {
    const url = urlBase + "/signup";
  
    request(
      {
        url: url,
        json: true,
        method: "POST",
        headers: { "content-type": "application/json" },
        body: {
          secretKey: secretKey,
          name: name,
          email: email,
          password: password,
        },
      },
      (error, response) => {
        if (error) {
          callback(errMessage, undefined);
        } else {
          const data = response.body;
          callback(undefined, data);
        }
      }
    );
    
  };


const signin = (email, password, callback) => {
    const url = urlBase + "/signin";
  
    request(
      {
        url: url,
        json: true,
        method: "POST",
        headers: { "content-type": "application/json" },
        body: {
          secretKey: secretKey,
          email: email,
          password: password,
        },
      },
      (error, response) => {
        if (error) {
          callback(errMessage, undefined);
        } else {
          const data = response.body;
          callback(undefined, data);
        }
      }
    );
    
};

module.exports = {
    signup,
    signin
}