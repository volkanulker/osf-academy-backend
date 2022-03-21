const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')

router.get('/signin', authController.signin_index)


router.get('/signup', authController.signup_index)


router.post('/signin', authController.signin_post)


router.post('/signup', authController.signup_post )


router.get('/logout', authController.logout)


module.exports = router;