"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */

const { mongoose } = require("../configs/dbConnection");
/*------------------------------------
{
    "flightNumber": "IS-AN-001",
    "airline": "THY",
    "departure": "ISTANBUL",
    "departureDate": "2020-10-01 10:00:00",
    "arrival": "ANKARA",
    "arrivalDate": "2020-10-01 12:00:00",
    "createdId": "652ceaa1bae9cde5e8a97522"
}
{
  "flightNumber": "IS-AN-002",
  "airline": "THY",
  "departure": "ISTANBUL",
  "departureDate": "2020-10-01 23:00:00",
  "arrival": "ANTALYA",
  "arrivalDate": "2020-10-02 03:00:00",
  "createdId": "65317b1c29b1267920ddf30d"
}

*/ //---------------------------------------------

const FlightsSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },

    airline: {
      type: String,
      required: true,
      trim: true,
    },

    deparature: {
      type: String,
      required: true,
      trim: true,
    },
    deparatureDate: {
      type: Date,
      required: true,
    },

    arrival: {
      type: String,
      required: true,
      trim: true,
    },

    arrivalDate: {
      type: Date,
      required: true,
    },

    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "flights",
    timestamps: true,
  }
);

module.exports = mongoose.model("Flight", FlightsSchema);
