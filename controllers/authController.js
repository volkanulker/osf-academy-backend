const authRequest = require('../requests/auth')


module.exports.signin_index = (req, res) => {
    res.render('auth/signin')
}


module.exports.signup_index = (req, res) => {
    res.render('auth/signup')
}

module.exports.signin_post = async (req, res) => {
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
            res.cookie('email', user.email, { httpOnly:true })
            return res.status(201).json( { user: user._id })
        }

        const internalError = {
            error:'An error is occured please try again later'
        }
        return res.status(500).json( internalError )
        

    })

}


module.exports.signup_post = (req, res) => {
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
            res.cookie('email', user.email, { httpOnly:true })
            return res.status(201).json( { user: user._id })
        }

        const internalError = {
            error:'An error is occured please try again later'
        }
        return res.status(500).json( internalError )

    })

}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge:1 })
    res.cookie('email', '', { maxAge:1 })
    res.redirect('/')
}