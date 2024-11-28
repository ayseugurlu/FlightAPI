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
                #swagger.description = 'Login with userName (or email) and password for get simpleToken and JWT'
                #swagger.parameters["body"] = {
                    in: "body",
                    required: true,
                    schema: {
                        "userName": "test",
                        "password": "aA?123456",
                    }
                }
            */

        const { userName, email, password } = req.body;

        if (!((userName || email) && password)) {
            res.errorStatusCode = 401;
            throw new Error("userName/email and password are required");
        }

        const user = await User.findOne({ $or: [{ userName }, { email }] });

        if (user?.password !== passwordEncrypt(password)) {
            res.errorStatusCode = 401;
            throw new Error("incorrect userName/email or password.");
        }

        if (!user.isActive) {
            res.errorStatusCode = 401;
            throw new Error("This account is not active.");
        }

        /* JWT */
        // ACCESS TOKEN
        const accessData = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isActive: user.isActive,
            isAdmin: user.isAdmin,
        }
        // Convert to JWT:
        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, { expiresIn: '30m' })

        // REFRESH TOKEN
        const refreshData = {
            _id: user._id,
            password: user.password
        }
        // Convert to JWT:
        const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, { expiresIn: '3d' })
        /* JWT */

        res.send({
            error: false,
            bearer: {
                access: accessToken,
                refresh: refreshToken
            },
        });
    },

    refresh: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Refresh"
            #swagger.description = 'Refresh with refreshToken for get accessToken'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "bearer": {
                        refresh: '...refresh_token...'
                    }
                }
            }
        */

        const refreshToken = req.body?.bearer?.refresh

        if (refreshToken) {

            const refreshData = await jwt.verify(refreshToken, process.env.REFRESH_KEY)
            // console.log(refreshData)

            if (refreshData) {

                const user = await User.findOne({ _id: refreshData._id })

                if (user && user.password == refreshData.password) {

                    if (user.isActive) {

                        res.status(200).send({
                            error: false,
                            bearer: {
                                access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, { expiresIn: '30m' })
                            }
                        })

                    } else {
                        res.errorStatusCode = 401
                        throw new Error("This account is not active.")
                    }
                } else {
                    res.errorStatusCode = 401
                    throw new Error('Wrong id or password.')
                }
            } else {
                res.errorStatusCode = 401
                throw new Error('JWT refresh data is wrong.')
            }
        } else {
            res.errorStatusCode = 401
            throw new Error('Please enter bearer.refresh')
        }

    },

    logout: async (req, res) => {
        /*
                #swagger.tags = ["Authentication"]
                #swagger.summary = "logout"
            */

        res.send({
            error: false,
            message: 'JWT: No need any process for logout.',
        })
    },
}