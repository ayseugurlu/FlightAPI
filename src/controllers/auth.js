"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Auth Controller:

const User = require('../models/user')
const passwordEncrypt = require('../helpers/passwordEncrypt')
const jwt = require('jsonwebtoken')

module.exports = {


    login: async (req, res) => {

        
     /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

        const { userName, email, password } = req.body

        if (!((userName || email) && password)) {
            res.errorStatusCode = 401
            throw new Error("Username / Email and Password required!")
        }

        const user = await User.findOne({ $or: [{ userName }, { email }] })

        if (user?.password !== passwordEncrypt(password)) {
            res.errorStatusCode = 401
            throw new Error('Incorrect Credeantials!')
        }

        if(!user.isActive){
            res.errorStatusCode = 401;
            throw new Error("This account is not active.");
        }

        //*jwt

        const accessData = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isActive: user.isActive,
            isAdmin: user.isAdmin,
            isStaff: user.isStaff
        }

        // Convert to JWT
        // jwt.sign(payload, key, { expireIn: 3m})

        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {expiresIn : '30m'})

        const refreshData = {
            _id: user._id,
            password: user.password
        }

        const refreshToken = jwt.sign( refreshData, process.env.REFRESH_KEY, {expiresIn : '1d'})

        res.status(200).send({
            error: false,
            bearer: {
                access: accessToken,
                refresh: refreshToken
            },
           
        })


    },

    refresh: async(req,res) => {

     /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Refresh"
            #swagger.description = 'Login with username (or email) and password for JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

        const refreshToken = req.body?.bearer.refresh

        if(!refreshToken){
            res.errorStatusCode = 401
            throw new Error('Please enter bearer.refresh')
        }

        const refreshData = await jwt.verify(refreshToken, process.env.REFRESH_KEY )

        if(!refreshData){
            res.errorStatusCode = 401
            throw new Error('JWT refresh Token is wrong.')
        }

        const user = await User.findOne({ _id: refreshData._id})

        if(!(user && user.password == refreshData.password)){
            res.errorStatusCode = 401
            throw new Error('Wrong id or password.')
        }

        if(!user.isActive) {
            res.errorStatusCode = 401
            throw new Error("This account is not active.")
        }

        res.status(200).send({
            error:false,
            bearer:{
                access: jwt.sign( user.toJSON(), process.env.ACCESS_KEY, {expiresIn: '30m' })
            }
        })

    },

    logout: async(req,res) => {

             /*
         #swagger.tags = ["Authentication"]
         #swagger.summary = "Logout"
         #swagger.description = 'Logs the user out. No specific process needed for logout as JWT tokens are stateless.'
     */

         

        // const blacklistedTokens = []; //bu normalde tepede globalde olmali

        // const auth = req.headers?.authorization

        // const tokenKey = auth? auth.split(' ')[1] : null

        // if(tokenKey){

        //     blackListedToken.push(tokenKey)
        //     res.status(200).send({
        //         error:false,
        //         message: 'Token blacklisted'
        //     })

        // }else{
        //     res.status(400).send({ message: 'Token is missing' });
        // }
        
       
        
                res.send({
                    error: false,
                    message: 'JWT: No need any process for logout.',
                })

    }
}