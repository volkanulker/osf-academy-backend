const express = require("express");
const router = express.Router();
const {createCheckoutSession, successPayment, cancelPayment} = require('../controllers/paymentController')

router.post('/create-checkout-session', createCheckoutSession)

router.get('/success', successPayment)

router.get('/cancel', cancelPayment)


module.exports = router;