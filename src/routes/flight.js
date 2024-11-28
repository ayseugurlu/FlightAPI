"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
const router = require('express').Router()
const {list, create, read, update, deleteFlight} = require('../controllers/flight')

const {isLogin, isAdmin} = require('../middlewares/permissions')

/* ------------------------------------------------------- */

// URL: /flights


router.route('/')
    .get(list)
    .post(isLogin,create)

router.route('/:id')
    .get(read)
    .put(isLogin, update)
    .patch(isLogin, update)
    .delete(isLogin ,isAdmin, deleteFlight)


/* ------------------------------------------------------- */
module.exports = router