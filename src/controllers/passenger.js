
"use strict"

// passenger Controller:

const Passenger = require('../models/passenger')

module.exports = {
    list: async (req, res) => {
        /* 
            #swagger.tags = ["Passengers"]
            #swagger.summary = "List Passengers"
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

        const result = await res.getModelList(Passenger, {}, "createdId")

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Passenger),
            result

        })
    },

    create: async (req, res) => {
        // $ref: '#/definitions/flight'
        /* 
            #swagger.tags = ["Passengers"]
            #swagger.summary = "Create Passenger"
            #swagger.parameters['body'] = {
                in:'body',
                required: true,
                schema: {
                   $ref: '#/definitions/flight'
                }
            }
        */

        const result = await Passenger.create(req.body)

        res.status(201).send({
            error: false,
            result
        })

    },

    read: async (req, res) => {
        /* 
            #swagger.tags = ["Passengers"]
            #swagger.summary = "Read Passenger"
        */

            const { createdId } = req.body

        const result = await Passenger.findOne({ _id: req.params.id }).populate("createdId")

        res.status(200).send({
            error: false,
            result

        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Passengers"]
            #swagger.summary = "Update Passenger"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/flight'
                }
            }
        */

        const result = await Passenger.updateOne({ _id: req.params.id }, req.body, { new: true, runValidators: true })

        res.status(202).send({
            error: false,
            result
        })
    },

    deletePassenger: async () => {
        /*
            #swagger.tags = ["Passengers"]
            #swagger.summary = "Delete Passenger"
        */

        const { deletedCount } = await Passenger.deleteOne({ _id: req.params.id })

        res.status(deletedCount ? 204 : 404).send({
            error: !deletedCount
        })
    }
}
