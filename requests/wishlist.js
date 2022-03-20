const request = require("request");
const urlBase =
  "https://osf-digital-backend-academy.herokuapp.com/api/wishlist";

const secretKey =
  "$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS";

const errMessage = "Unable to connect to the Backend Service!";



module.exports.getWishlist = (token, callback) =>{
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



module.exports.addItem = (token, productId, variantId, quantity, callback) => {
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


  module.exports.removeItem = (token, productId, variantId,callback) => {
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



  module.exports.changeItemQuantity = (token, productId, variantId,quantity,callback) => {
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
  