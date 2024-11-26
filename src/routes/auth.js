"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
const { login , refresh, logout} = require('../controllers/auth')
/* ------------------------------------------------------- */

// URL: /auth

router.route('/login').post(login)
router.route('/refresh').post(refresh)
router.route('/logout').get(logout)
/* ------------------------------------------------------- */
module.exports = router