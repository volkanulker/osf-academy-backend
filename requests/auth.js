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


// {
//   user: {
//     _id: '622c7c7b9d72600024624af2',
//     secretKey: '$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS',
//     name: 'testName12',
//     email: 'test123@hotmail.com',
//     password: '$2a$08$TjUdcHVwQBOozPQ5uLIhDuGaNj1CDJZ/yur3ExsQdHARuPncuF0XW',
//     createdAt: '2022-03-12T10:56:59.264Z',
//     __v: 0
//   },
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmM3YzdiOWQ3MjYwMDAyNDYyNGFmMiIsImlhdCI6MTY0Nzk3MDk4NSwiZXhwIjoxNjQ4MDU3Mzg1fQ.MbKZkTnCgtAV6u1mJis_VzjRV02MXsjp8GFSLX7tAXc'
// } 


module.exports.getToken = (email, password, callback) => {
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
        const { token } =  data
        callback(undefined, {token:token});
      }
    }
  );

};

