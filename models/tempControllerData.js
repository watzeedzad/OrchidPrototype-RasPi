const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence");

const {
    Schema
} = mongoose;

const tempControllerDataSchema = new Schcema({
    
});

tempControllerDataSchema.plugin(autoIncrement, {
    inc_field: "temp_controller_dataId"
});
mongoose.model("");