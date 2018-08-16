const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence");

const {
    Schema
} = mongoose;

const tempGreenHouseDataSchema = new Schema({
    ip: String,
    piMacAddress: String,
    temperature: Number,
    humidity: Number,
    soilMoisture: Number,
    ambientLight: Number,
    farmId: Number,
    greenHouseId: Number
});

tempGreenHouseDataSchema.plugin(autoIncrement, {
    inc_field: "tempGreenHouseDataId"
});
mongoose.model("temp_greenhouse_data", tempGreenHouseDataSchema, "temp_greenhouse_data")