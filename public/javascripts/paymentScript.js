
function makePayment(){
    let errorMessageEl = document.getElementById('error-message')
    errorMessageEl.textContent = ''
    if(cartObjects.length > 0 ){
        fetch('/payment/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                items:cartObjects.map( cartObj => {
                    return {
                        id:cartObj.productId,
                        quantity:cartObj.quantity,
                        price:cartObj.price,
                        name:cartObj.name
                    }
                })
            })
        }).then(res => {
            if(res.ok){
                return res.json()
            }
            return res.json().then(json => Promise.reject(json))
        }).then( ({ url }) => {
            window.location = url
        }).catch(e => {
            errorMessageEl.textContent = e.error
        })
    } else{
        errorMessageEl.textContent = 'There is no item to buy.'
    }
}

