const express = require("express");
const router = express.Router();


router.get('/login', (req, res) => {
    res.render('auth/login')
})


router.get('/signup', (req, res) => {
    res.render('auth/signup')
})


router.post('/login', (req, res) => {
    res.send('post request to login')
})


router.post('/signup', (req, res) => {
    res.send('post request to signup')
})










module.exports = router;