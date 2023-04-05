const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeSchema = new Schema(
    {
        exchange: {
            type: String,
            required: true,
        },

        fiat: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        spread: {
            type: Number,
            required: true,
        },

        profit: {
            type: Number,
            required: true,
        },

        maxSingleTransAmount: {
            type: String,
            required: true,
        },

        minSingleTransAmount: {
            type: String,
            required: true,
        },

        routes: [{

            peyment: {
                type: String,
                required: false,
            },
            asset: {
                type: String,
                required: false,
            },
            price: {
                type: JSON,
                required: false,
            },
            maxSingleTransAmount: {
                type: String,
                required: true,
            },
            minSingleTransAmount: {
                type: String,
                required: true,
            },

        }],

    },
    {
        timestamps: true,
    }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
