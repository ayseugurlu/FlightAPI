"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const {mongoose} = require('../configs/dbConnection')

/* ------------------------------------------------------- *
{
    "firstName": "FirstName 1",
    "lastName": "LastName",
    "gender": "F",
    "email": "test1@site.com",
    "createdId": "65317b1c29b1267920ddf30d"
}
/* ------------------------------------------------------- */

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
        enum: [null, 'M', 'F'],
        default: null
    },

    email: {
        type: String,
        required: [true, "Email field musst be reuired"],
        unique: [true, 'There is this email. Email field must be unique.'],
        validate: [
            (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
            "Please fill a valid email address",
        ]

    },

    createdId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{
    collection: 'passengers',
    timestamps:true
})

module.exports = mongoose.model('Passenger', passengerSchema)