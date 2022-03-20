const request = require("request");
require('dotenv').config()


const urlBase =
  "https://osf-digital-backend-academy.herokuapp.com/api/auth";


const secretKey = process.env.SECRET_KEY

const errMessage = "Unable to connect to the Backend Service!";

module.exports.signup = (name, email, password, callback) => {
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


module.exports.signin = (email, password, callback) => {
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
