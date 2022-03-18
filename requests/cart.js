
const request = require("request");
const urlBase =
  "https://osf-digital-backend-academy.herokuapp.com/api/cart";

const secretKey =
  "$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS";

const errMessage = "Unable to connect to the Backend Service!";


// const token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmM3YzdiOWQ3MjYwMDAyNDYyNGFmMiIsImlhdCI6MTY0NzYwNjUwOCwiZXhwIjoxNjQ3NjkyOTA4fQ.VnwD5xqCrvgQ8R5MVnSMRQBO2ia9-jgxHVO-exUkqGY'


module.exports.getCart = (token, callback) =>{
    const url = urlBase + `?secretKey=${secretKey}`;
   
    request(
      {
        url: url,
        method: "GET",
        json:true,
        headers: { "content-type": "application/json", "Authorization": `Bearer ${token}`},
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
}

module.exports.addItem = (productId, variantId, quantity, callback) => {
  const url = urlBase + '/addItem' + `?secretKey=${secretKey}`;
  
  request(
    {
      url: url,
      method: "POST",
      json:true,
      headers: { "content-type": "application/json", "Authorization": `Bearer ${token}`},
      body: {
        "secretKey": `${secretKey}`,
        "productId": productId,
        "variantId": variantId,
        "quantity": quantity
      }
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

}


module.exports.removeItem = (productId, variantId,callback) => {
  const url = urlBase + '/removeItem' + `?secretKey=${secretKey}`;
  request(
    {
      url: url,
      method: "DELETE",
      json:true,
      headers: { "content-type": "application/json", "Authorization": `Bearer ${token}`},
      body: {
        "secretKey": `${secretKey}`,
        "productId": productId,
        "variantId": variantId,
      }
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

}

module.exports.changeItemQuantity = (productId, variantId,quantity,callback) => {
  const url = urlBase + '/changeItemQuantity' + `?secretKey=${secretKey}`;
  request(
    {
      url: url,
      method: "POST",
      json:true,
      headers: { "content-type": "application/json", "Authorization": `Bearer ${token}`},
      body: {
        "secretKey": `${secretKey}`,
        "productId": productId,
        "variantId": variantId,
        "quantity": quantity
      }
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
}
