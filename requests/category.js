const request = require('request')

const urlBase = "https://osf-digital-backend-academy.herokuapp.com/api/categories"


const secretKey ="$2a$08$snapaHu1X69uonct1IluteSCG4e1QJAUmtWSmEoX8lroGixq5/UqS"


const errMessage = 'Unable to connect to the Backend Service!'


const getAllCategories = (callback) => {
    const url = urlBase + `?secretKey=${secretKey}`

    request({url:url, json:true}, (error, response) => {
        if(error){
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    })
    
}


const getCategoriesByParentId = (id,callback) => {
    const path = `/parent/${id}`
    const url = urlBase + path + `?secretKey=${secretKey}`

    request({url:url, json:true}, (error, response) => {
        if(error){
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    })
}


const getCategoryById = (categoryId, callback) => {
    const path = `/${categoryId}`
    const url = urlBase + path + `?secretKey=${secretKey}`

    request({url:url, json:true}, (error, response) => {
        if(error) {
            callback(errMessage, undefined)
        } else{
            const data = response.body
            callback(undefined, data)
        }
    })
}



module.exports = {
    getAllCategories:getAllCategories,
    getCategoriesByParentId: getCategoriesByParentId,
    getCategoryById:getCategoriesById
}

