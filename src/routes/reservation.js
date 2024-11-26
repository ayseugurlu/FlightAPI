"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
const {list, create, read, update, deleteReservation} = require('../controllers/reservation')
/* ------------------------------------------------------- */

// URL: /passengers


router.route('/')
    .get(list)
    .post(create)

router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deleteReservation)


/* ------------------------------------------------------- */
module.exports = router