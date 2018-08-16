const mongoose = require("mongoose");
const tempGreenHouseData = mongoose.model("temp_greenhouse_data");
const tempProjectData = mongoose.model("temp_project_data");
const knowController = mongoose.model("know_controller");

let tempGreenHouseDataResult;
let tempProjectDataResult;

export default class SummarySernsorData {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        await getTempGreenHouseData(macAddressGlobal);
        await getTempProjectData(macAddressGlobal);
        let rawTempGreenHouseData = {};
        let rawTempProjectData = {};
        for (let index = 0; index < tempGreenHouseDataResult.length; index++) {
            
        }
        for (let index = 0; index < tempProjectDataResult.length; index++) {

        }
    }
}

async function getTempGreenHouseData(piMacAddress) {
    await tempGreenHouseData.find({
        piMacAddress: piMacAddress
    }, {}, {
        sort: {
            greenHouseId: 1
        }
    }, (err, result) => {
        if (err) {
            tempGreenHouseDataResult = undefined;
            console.log("[SummarySensorData] getTempGreenHouseData (err): " + err);
        } else if (!result) {
            tempGreenHouseDataResult = undefined;
            console.log("[SummarySensorData] getTempGreenHouseData (!result): " + result);
        } else {
            tempGreenHouseDataResult = result;
        }
    });
}

async function getTempProjectData(piMacAddress) {
    await tempProjectData.find({
        piMacAddress: piMacAddress
    }, {}, {
        sort: {
            projectId: 1
        }
    }, (err, result) => {
        if (err) {
            tempProjectDataResult = undefined;
            console.log("[SummarySensorData] getTempProjectData (err): " + err);
        } else if (!result) {
            tempProjectDataResult = undefined;
            console.log("[SummarySensorData] getTEmpPorjectData (!result): " + result);
        } else {
            tempProjectData = result;
        }
    })
}

async function summaryTempGreenHouseData(dataArray) {

}

async function summaryTempProjectData(dataArray) {

}