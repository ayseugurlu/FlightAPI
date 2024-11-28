"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
const permissions = require('../middlewares/permissions')
const reservation = require('../controllers/reservation')
/* ------------------------------------------------------- */

// URL: /reservations

router.use(permissions.isStaffOrAdmin)

router.route('/')
    .get(reservation.list)
    .post(reservation.create)

router.route('/:id')
    .get(reservation.read)
    .put(reservation.update)
    .patch(reservation.update)
    .delete(permissions.isAdmin, reservation.delete)

/* ------------------------------------------------------- */
module.exports = router