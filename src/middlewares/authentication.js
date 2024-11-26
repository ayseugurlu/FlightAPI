"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    req.user = null 

    const auth = req.headers?.authorization // Bearer ...accessToken...

    const tokenKey = auth ? auth.split(' ') : null //['Bearer', '...accessToken...']

    if(tokenKey){

        jwt.verify( tokenKey[1], process.env.ACCESS_KEY, (err, accessData) => {
            req.user = accessData ? accessData : null
        })
     
    }

   
    next()
}