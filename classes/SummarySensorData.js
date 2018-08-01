const mongoose = require("mongoose");
const tempGreenHouseData = mongoose.model("temp_greenhouse_data");
const tempProjectData = mongoose.model("temp_project_data");
const knowController = mongoose.model("know_controller");

export default class SummarySernsorData {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

    }
}

async function findRelatedFarmData(ip, piMacAddress) {
    await knowController.findOne({
        ip: ip,
        piMacAddress: piMacAddress
    }, (err, result) => {
        if (err) {
            knowControllerResultData = undefined;
            console.log("[HandleController]")
        }
    })
}