"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const {mongoose} = require('../configs/dbConnection')


const FlightsSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        unique: true,
        trim:true
    },

    airline : {
        type: String,
        required: true,
        trim:true,
    },

    deparature: {
        type: String,
        required: true,
        trim:true,
    },
    deparatureDate:{
        type:Date,
        required:true,
    },

    arrival: {
        type: String,
        required: true,
        trim:true
    },

    arrivalDate: {
        type:Date,
        required:true,
    },

    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    collection:'flights',
    timestamps:true
})

module.exports = mongoose.model('Flight', FlightsSchema)