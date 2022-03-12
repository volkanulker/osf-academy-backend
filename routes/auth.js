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

    authRequest.signin(email, password, (error,data) => {
        if(error){
            const errorToSend = {
                error: error
            }
            return res.status(400).json(errorToSend)
        }

        if(data.error){
            return res.status(400).json( data )
        }

        if(data.user){
            const { token } = data
            const { user } = data
            res.cookie('jwt', token, { httpOnly:true })
            return res.status(201).json( { user: user._id })
        }

        const internalError = {
            error:'An error is occured please try again later'
        }
        return res.status(500).json( internalError )
        

    })

})


router.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    authRequest.signup( name, email, password, (error, data) => {
        if(error){
            const errorToSend = {
                error:error
            }
            return res.status(400).json( errorToSend )
        }

        if(data.error){
            return res.status(400).json( data )
        }

        if(data.user){
            const { token } = data
            const { user } = data
            res.cookie('jwt', token, { httpOnly:true })
            return res.status(201).json( { user: user._id })
        }

        const internalError = {
            error:'An error is occured please try again later'
        }
        return res.status(500).json( internalError )

    })

})




module.exports = router;