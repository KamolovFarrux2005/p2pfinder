const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const { init } = require('./src/index.js');
const { DATABASE } = process.env;

mongoose.connect(DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    async function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected to the database");
            init();
        }
    }
)