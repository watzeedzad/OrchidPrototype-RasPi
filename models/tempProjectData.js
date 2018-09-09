const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const {
    Schema
} = mongoose;

const tempProjectDataSchema = new Schema({
    ip: String,
    piMacAddress: String,
    soilFertility: Number,
    farmId: Number,
    projectId: Number
});

tempProjectDataSchema.plugin(autoIncrement, {
    inc_field: "tempProjectDataId"
});
mongoose.model("temp_project_data", tempProjectDataSchema, "temp_project_data");