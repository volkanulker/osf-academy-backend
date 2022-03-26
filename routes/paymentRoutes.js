const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController')

router.post('/create-checkout-session', paymentController.createCheckoutSession)


router.get('/success', paymentController.successPayment)

router.get('/cancel', paymentController.cancelPayment)


module.exports = router;