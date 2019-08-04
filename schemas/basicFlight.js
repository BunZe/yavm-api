const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basicflightSchema = new Schema({
    callsign: String,
    dep: {
        code: {
            iata: String,
            icao: String,
        }
    },
    arr: {
        code: {
            iata: String,
            icao: String,
        }
    },
    aircraftType: String,
    position: {
        lat: Number,
        long: Number
    },
    speed: Number,
    altitude: Number,
    heading: Number
})

module.exports = basicflightSchema;