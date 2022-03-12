const express = require("express");
const router = express.Router();
const authRequest = require('../requests/auth')

router.get('/signin', (req, res) => {
    res.render('auth/signin')
})


router.get('/signup', (req, res) => {
    res.render('auth/signup')
})


router.post('/signin', async (req, res) => {
    const {email, password} = req.body
    console.log("email:" + email)
    console.log("password:"+ password)
    authRequest.signin(email, password, (error,data) => {
        if(error){
            return res.status(400).json(error)
        }

        const { token } = data
        const { user } = data
        res.cookie('jwt', token, {httpOnly:true})
        res.status(200).json({user: user._id})

    })

})


router.post('/signup', (req, res) => {
    res.send('post request to signup')
})




module.exports = router;