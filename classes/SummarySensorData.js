const mongoose = require("mongoose");
const tempGreenHouseData = mongoose.model("temp_greenhouse_data");
const tempProjectData = mongoose.model("temp_project_data");
const request = require("request");
const simpleStats = require("simple-statistics");

let tempGreenHouseDataResult;
let tempProjectDataResult;

export default class SummarySernsorData {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        await getTempGreenHouseData(macAddressGlobal);
        await getTempProjectData(macAddressGlobal);
        let rawTempGreenHouseData = [];
        let rawTempProjectData = [];
        let currentRawTempGreenHouseIndex = 0;
        let currentRawTempProjetIndex = 0;
        for (let index = 0; index < tempGreenHouseDataResult.length; index++) {
            let unAvgData;
            if (rawTempGreenHouseData.length == 0) {
                unAvgData = {
                    farmId: tempGreenHouseDataResult[index].farmId,
                    greenHouseId: tempGreenHouseDataResult[index].greenHouseId,
                    ip: tempGreenHouseDataResult[index].ip,
                    piMacAddress: tempGreenHouseDataResult[index].piMacAddress,
                    temperature: [tempGreenHouseDataResult[index].temperature],
                    humidity: [tempGreenHouseDataResult[index].humidity],
                    soilMoisture: [tempGreenHouseDataResult[index].soilMoisture],
                    ambientLight: [tempGreenHouseDataResult[index].ambientLight]
                }
                rawTempGreenHouseData.push(unAvgData);
            } else if (rawTempGreenHouseData[currentRawTempGreenHouseIndex].greenHouseId == tempGreenHouseDataResult[index].greenHouseId) {
                let temp = rawTempGreenHouseData[currentRawTempGreenHouseIndex];
                temp.temperature.push(tempGreenHouseDataResult[index].temperature);
                temp.humidity.push(tempGreenHouseDataResult[index].humidity);
                temp.soilMoisture.push(tempGreenHouseDataResult[index].soilMoisture);
                temp.ambientLight.push(tempGreenHouseDataResult[index].ambientLight);
                rawTempGreenHouseData[currentRawTempGreenHouseIndex] = temp;
            } else {
                unAvgData = {
                    farmId: tempGreenHouseDataResult[index].farmId,
                    greenHouseId: tempGreenHouseDataResult[index].greenHouseId,
                    ip: tempGreenHouseDataResult[index].ip,
                    piMacAddress: tempGreenHouseDataResult[index].piMacAddress,
                    temperature: [tempGreenHouseDataResult[index].temperature],
                    humidity: [tempGreenHouseDataResult[index].humidity],
                    soilMoisture: [tempGreenHouseDataResult[index].soilMoisture],
                    ambientLight: [tempGreenHouseDataResult[index].ambientLight]
                }
                rawTempGreenHouseData.push(unAvgData);
                currentRawTempGreenHouseIndex++;
            }
        }
        for (let index = 0; index < tempProjectDataResult.length; index++) {
            let unAvgData;
            if (rawTempProjectData.length == 0) {
                unAvgData = {
                    farmId: tempProjectDataResult[index].farmId,
                    projectId: tempProjectDataResult[index].projectId,
                    ip: tempProjectDataResult[index].ip,
                    piMacAddress: tempProjectDataResult[index].piMacAddress,
                    soilFertility: [tempProjectDataResult[index].soilFertility]
                }
                rawTempProjectData.push(unAvgData);
            } else if (rawTempProjectData[currentRawTempProjetIndex].projectId == tempProjectDataResult[index].projectId) {
                let temp = rawTempProjectData[currentRawTempProjetIndex];
                temp.soilFertility.push(tempProjectDataResult[index].soilFertility);
                rawTempProjectData[currentRawTempProjetIndex] = temp;
            } else {
                unAvgData = {
                    farmId: tempProjectDataResult[index].farmId,
                    projectId: tempProjectDataResult[index].projectId,
                    ip: tempProjectDataResult[index].ip,
                    piMacAddress: tempProjectDataResult[index].piMacAddress,
                    soilFertility: [tempProjectDataResult[index].soilFertility]
                }
                rawTempProjectData.push(unAvgData);
                currentRawTempProjetIndex++;
            }
        }
        for (let index = 0; index < rawTempGreenHouseData.length; index++) {
            let temp = rawTempGreenHouseData[index];
            temp.temperature = simpleStats.mean(temp.temperature);
            temp.humidity = simpleStats.mean(temp.humidity);
            temp.soilMoisture = simpleStats.mean(temp.soilMoisture);
            temp.ambientLight = simpleStats.mean(temp.ambientLight);
            rawTempGreenHouseData[index] = temp;
        }
        for (let index = 0; index < rawTempProjectData.length; index++) {
            let temp = rawTempProjectData[index];
            temp.soilFertility = simpleStats.mean(temp.soilFertility);
            rawTempProjectData[index] = temp;
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

function sendSummarizeData(dataArray, type) {
    request.post({
        url: "https://hello-api.careerity.me",
        body: dataArray,
        json: true
    }, {
        timeout: 20000
    }, function (err, resopne, body) {

    });
}