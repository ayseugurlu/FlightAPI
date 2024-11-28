"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    req.user = null

    const auth = req.headers?.authorization || null
    const tokenKey = auth ? auth.split(' ') : null

    if (tokenKey && tokenKey[0] == "Bearer") {

        jwt.verify(tokenKey[1], process.env.ACCESS_KEY, function (error, accessData) {

            req.user = accessData ? accessData : null
            req.body.createdId = req.user?._id

        })

    }
    
    next()
}