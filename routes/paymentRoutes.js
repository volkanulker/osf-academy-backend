const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

router.post('/create-checkout-session', async (req, res) => {
    const productsToBuy = req.body.items
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode: 'payment',
            line_items: productsToBuy.map( product => {
                return {
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:product.name
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: product.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/payment/success`,
            cancel_url: `${process.env.SERVER_URL}/payment/cancel`
        })
        res.status(200).json( { url: session.url })
    }catch(e) {
        res.status(500).json( {error: e.message})
    }

})


router.get('/success', (req, res) => {
    res.render('./payment/success')
})

router.get('/cancel', (req, res) => {
    res.render('./payment/cancel')
})


module.exports = router;