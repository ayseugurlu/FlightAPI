"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const {mongoose} = require('../configs/dbConnection')

const reservationSchema = new mongoose.Schema({
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },

    passengers:[
        {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Passenger'
        }
    ],

    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }


}, {
    collection: 'reservations',
    timestamps: true
})

module.exports = mongoose.model('Reservation', reservationSchema)