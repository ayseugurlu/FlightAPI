"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
const { login, refresh, logout } = require('../controllers/auth')
/* ------------------------------------------------------- */

// URL: /auth

router.route('/login').post(login)
router.post('/refresh', refresh)
router.get('/logout', logout)


/* ------------------------------------------------------- */
module.exports = router