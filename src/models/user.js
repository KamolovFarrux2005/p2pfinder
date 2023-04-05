const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        telegram_id: {
            type: String,
            trim: true,
            required: true,
        },

        defaults: {
            type: JSON,
            required: false,
        },

        username: {
            type: String,
            trim: true,
            required: false,
        },

        phone: {
            type: String,
            trim: true,
            required: false,
        },

        is_superuser: {
            type: Number,
            required: true,
            default: 0,
        },

        status_auth: {
            type: String,
            enum: ["active", "inactive", "limited", "deleted"],
            default: "inactive",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
