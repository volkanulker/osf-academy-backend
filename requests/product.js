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


const getProductsByPage = (pageNo,callback) => {
    let url = `${urlBase}?page=${pageNo}&secretKey=${secretKey}`
    request({ url:url, json:true }, (error, response) => {
    
        if(error){
            return callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    }) 
}
/*
* Make request to api one by one to find total number of page 
* in the api dynamically if no data.error returned by the url
* catch error and stop while loop then get promise array
*/
module.exports.getAllProducts =  async (callback) => {
    var productArr = []
    let pageNo = 1
    let isAllPageSearched = false
    while(!isAllPageSearched){
        await new Promise((resolve, reject) => {
            getProductsByPage(pageNo, (error, data) => {
                if(data.error){
                    reject(data.error)                
                } else{
                    resolve(data)
                }
            })
        }).catch((errorMessage) => {
            isAllPageSearched = true
        }).then(d => {
            productArr.push(d)
        })

        pageNo += 1
    }
    callback(undefined, productArr)
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

