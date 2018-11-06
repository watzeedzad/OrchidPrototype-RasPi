const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");
const tempAutoWatering = mongoose.model("temp_watering_history");
const tempAutoFertilizering = mongoose.model("temp_fertilizering_history");
const project = mongoose.model("project");

let controllerResultData;
let projectResultData;

export default class HandleFlowVolume {
    constructor(req, res) {
        operation(req, res);
    }
}

async function operation(req, res) {
    let pumpType = req.body.type;
    let volume = req.body.volume;
    let ip = req.body.ip;

    if (typeof pumpType === "undefined" || typeof volume === "undefined" || typeof ip == "undefined") {
        console.log("[HandleFlowVolume] one of require parameter is undefined: " + pumpType, volume, ip);
        res.sendStatus(500);
        return;
    }

    controllerResultData = await getControllerData(ip, macAddressGlobal);
    if (controllerResultData == null) {
        res.sendStatus(200);
        return;
    }
    if (typeof controllerResultData.greenHouseId === "undefined") {
        res.sendStatus(200);
        return;
    }

    if (pumpType == "water") {
        console.log("[HandleFlowVolume] enter check \"water\" pumpType case");
        await saveTempHistoryData(
            "water",
            volume,
            controllerResultData.farmId,
            controllerResultData.greenHouseId,
            null,
            null,
            function (saveTempHistoryDataResult) {
                if (saveTempHistoryDataResult) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            }
        );
        // console.log("[HandleFlowVolume] result: " + result);
        // if (result) {
        //     res.sendStatus(200);
        //     return;
        // } else {
        //     res.sendStatus(500);
        //     return;
        // }
    } else if (pumpType == "fertilizer") {
        console.log("[HandleFlowVolume] enter check \"fertilizer\" pumpType case");
        if (controllerResultData.projectId == null) {
            console.log("[HandleFlowVolume] projectId in controller is null");
            res.sendStatus(500);
            return;
        }
        projectResultData = await getProjectData(controllerResultData.farmId, controllerResultData.projectId);
        if (projectResultData == null) {
            console.log("[HandleFlowVolume] project data is null");
            res.sendStatus(500);
            return;
        }
        await saveTempHistoryData(
            "fertilizer",
            volume,
            controllerResultData.farmId,
            null,
            projectResultData.projectId,
            projectResultData.currentRatio,
            function (saveTempHistoryDataResult) {
                if (saveTempHistoryDataResult) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            }
        );
        // console.log("[HandleFlowVolume] result: " + result);
        // if (result) {
        //     res.sendStatus(200);
        //     return;
        // } else {
        //     res.sendStatus(500);
        //     return;
        // }
    }
    res.sendStatus(200);
}

async function getControllerData(ip, macAddressGlobal) {
    console.log("[HandleFlowVoulme] getControllerData (ip): " + ip);
    console.log("[HandleFlowVoulme] getControllerData (macAddressGlobal): " + macAddressGlobal);
    let result = await knowController.findOne({
        ip: ip,
        piMacAddress: macAddressGlobal
    }, function (err, result) {
        if (err) {
            controllerResultData = null;
            console.log("[HandleFlowVolume] getControllerData (err): " + err);
        } else if (!result) {
            controllerResultData = null;
            console.log("[HandleFlowVolume] getControllerData (!result): " + result);
        } else {
            controllerResultData = result;
        }
    });
    return result;
}

async function getProjectData(farmId, projectId) {
    let result = await project.findOne({
        farmId: farmId,
        projectId: projectId
    }, function (err, result) {
        if (err) {
            projectResultData = null;
            console.log("[HandleFlowVolume] getProjectData (err): " + err);
        } else if (!result) {
            projectResultData = null;
            console.log("[HandleFlowVolume] getProjectData (!result): " + result);
        } else {
            projectResultData = result;
        }
    });
    return result;
}

async function saveTempHistoryData(type, volume, farmId, greenHouseId, projectId, ratio, callback) {
    let saveTempHistoryDataResult;

    if (type == "water") {
        let newData = {
            farmId: farmId,
            greenHouseId: greenHouseId,
            amount: volume,
            timeStamp: new Date()
        }
        await tempAutoWatering(newData).save(function (err) {
            if (err) {
                saveTempHistoryDataResult = false;
                console.log("[HandleFlowValue] saveTempHistoryData (err): " + err);
            } else {
                saveTempHistoryDataResult = true;
                console.log("[HandleGlowValue] saveTempHistoryData: create new water data");
            }
            callback(saveTempHistoryDataResult);
        });
    } else if (type == "fertilizer") {
        let newData = {
            farmId: farmId,
            projectId: projectId,
            amount: volume,
            timeStamp: new Date(),
            ratio: ratio
        }
        await tempAutoFertilizering(newData).save(function (err) {
            if (err) {
                saveTempHistoryDataResult = false;
                console.log("[HandleFlowVolume] saveTempHistotyData (err): " + err);
            } else {
                saveTempHistoryDataResult = true;
                console.log("[HandleFlowVolume] saveTempHistoryData: create new fertilizer data");
            }
            callback(saveTempHistoryDataResult);
        });
    }
}