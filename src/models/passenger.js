"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const {mongoose} = require('../configs/dbConnection')

const passengerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        set: (firstName) => firstName.toUpperCase() 
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        set: (firstName) => firstName.toUpperCase()
    },

    gender:{
        type:String,
        trim: true
    },

    createdId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    collection: 'passengers',
    timestamps:true
})

module.exports = mongoose.model('Passenger', passengerSchema)