const request = require('request')

const urlBase = "https://osf-digital-backend-academy.herokuapp.com/api/products/product_search"


const secretKey ="$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS"


const errMessage = 'Unable to connect to the Backend Service!'


module.exports.getProductById = (id, callback) => {
    const url =`${urlBase}?id=${id}&secretKey=${secretKey}`

    request({url:url, json:true}, (error, response) => {
        if(error){
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    }) 
}


module.exports.getAllProducts = (callback) => {
    const url = `${urlBase}?secretKey=${secretKey}`

    request({ url:url, json:true }, (error, response) => {
        if(error){
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    })
}



module.exports.getProductByCategoryId = (id, callback) => {
    const url =`${urlBase}?primary_category_id=${id}&secretKey=${secretKey}`

    request({url:url, json:true}, (error, response) => {
        if(error){
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    }) 
}

