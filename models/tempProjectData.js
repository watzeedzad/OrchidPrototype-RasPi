const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence");

const {
    Schema
} = mongoose;

const tempProjectDataSchema = ({
    ip: String,
    piMacAddress: String,
    soilFertility: Number
});

tempProjectDataSchema.plugin(autoIncrement, {
    inc_field: "tempProjectDataId"
});
mongoose.model("temp_project_data", tempProjectDataSchema, "temp_project_data");