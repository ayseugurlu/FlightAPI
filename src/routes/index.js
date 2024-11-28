"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */


// auth
router.use('/auth', require('./auth'))
// user:
router.use('/users', require('./user'))

//flights
router.use('/flights', require('./flight')) 

//passengers
router.use('/passengers', require('./passenger'))

//reservatiopns
router.use('/reservations', require('./reservation'))


// documents:
router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router