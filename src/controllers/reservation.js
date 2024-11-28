
"use strict"

// passenger Controller:

const Reservation = require('../models/reservation')

module.exports = {
    list: async (req, res) => {
        /* 
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Reservations"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const result = await res.getModelList(Reservation)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Reservation),
            result

        })
    },

    create: async (req, res) => {
        // $ref: '#/definitions/flight'
        /* 
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Create Reservation"
            #swagger.parameters['body'] = {
                in:'body',
                required: true,
                schema: {
                   $ref: '#/definitions/flight'
                }
            }
        */

            const passengerInfos = req.body.passengers || []

            let passengerIds = []
            let invalidIds = []
            let passenger = {}

            for (let passengerInfo of passengerInfos){

                if( typeof passengerInfo == 'object') {

                    passenger = await Passenger.findOne ( {email : passengerInfo.email})

                    if(passenger){

                        passengerIds.push(passenger._id)
                    }else{

                        //Create passenger

                        passenger = await Passenger.create({ ...passengerInfo, createdId: req.user._id})

                        if( passenger) {
                            passengerIds.push(passenger._id)
                        }

                    }

                }else if( typeof passengerInfo == 'string'){

                    //check if passenger exist

                    passenger = await Passenger.findOne( {_id: passengerInfo})

                    //send the id to passengerIds array

                    if(passenger) passengerIds.push(passenger._id)
            
                }else{
                    invalidIds.push(passengerInfo)
                }

            }

            // console.log(passengerIds);
            // console.log(invalidIds);

            req.body.passengers = passengerIds

        const result = await Reservation.create(req.body)

        res.status(200).send({
            error: false,
            result
        })

    },

    read: async (req, res) => {
        /* 
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Read Reservation"
        */

            const { createdId } = req.body

        const result = await Reservation.findOne({ _id: req.params.id })

        res.status(200).send({
            error: false,
            result

        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Update Reservation"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/flight'
                }
            }
        */

        const result = await Reservation.updateOne({ _id: req.params.id }, req.body, { new: true, runValidators: true })

        res.status(202).send({
            error: false,
            result
        })
    },

    deleteReservation: async () => {
        /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Delete Reservation"
        */

        const { deletedCount } = await Reservation.deleteOne({ _id: req.params.id })

        res.status(deletedCount ? 204 : 404).send({
            error: !deletedCount
        })
    }
}
