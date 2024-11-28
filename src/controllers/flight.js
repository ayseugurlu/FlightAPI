
"use strict"

// flight Controller:

const Flight = require('../models/flight')

module.exports = {
    list: async (req, res) => {
        /* 
            #swagger.tags = ["Flights"]
            #swagger.summary = "List Flights"
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

        const result = await res.getModelList(Flight)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Flight),
            result

        })
    },

    create: async (req, res) => {
        // $ref: '#/definitions/flight'
        /* 
            #swagger.tags = ["Flights"]
            #swagger.summary = "Create Flight"
            #swagger.parameters['body'] = {
                in:'body',
                required: true,
                schema: {
                   $ref: '#/definitions/flights'
                }
            }
        */

        const result = await Flight.create(req.body)

        res.status(201).send({
            error: false,
            result
        })

    },

    read: async (req, res) => {
        /* 
            #swagger.tags = ["Flights"]
            #swagger.summary = "Read Flight"
        */

        const result = await Flight.findOne({ _id: req.params.id })

        res.status(200).send({
            error: false,
            result

        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Flights"]
            #swagger.summary = "Update Flight"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/flights'
                }
            }
        */

        const result = await Flight.updateOne({ _id: req.params.id }, req.body, { new: true, runValidators: true })

        res.status(202).send({
            error: false,
            result
        })
    },

    deleteFlight: async () => {
        /*
            #swagger.tags = ["Flights"]
            #swagger.summary = "Delete Flight"
        */

        const { deletedCount } = await Flight.deleteOne({ _id: req.params.id })

        res.status(deletedCount ? 204 : 404).send({
            error: !deletedCount
        })
    }
}
