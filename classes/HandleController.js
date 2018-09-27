const mongoose = require("mongoose");
const tempGreenHouseData = mongoose.model("temp_greenhouse_data");
const tempProjectData = mongoose.model("temp_project_data");
const knowController = mongoose.model("know_controller");

let knowControllerResultData;
let saveTempGreenHouseDataResult = false;
let saveTempProjectDataResult = false;

export default class HandleController {
  constructor(req, res) {
    this.operation(req, res);
  }

  async operation(req, res) {
    let ip = req.body.ip;
    let temp = req.body.temperature;
    let humid = req.body.humidity;
    let soilMoisture = req.body.soilMoisture;
    let ambientLight = req.body.ambientLight;
    let soilFertility = req.body.soilFertility;
    let type = req.body.type;
    console.log("[HandleController] ip: " + ip);
    console.log("[HandleController] temp: " + temp);
    console.log("[HandleController] humid: " + humid);
    console.log("[HandleController] soilMoisture: " + soilMoisture);
    console.log("[HandleController] ambientLight: " + ambientLight);
    console.log("[HandleController] soilFertility: " + soilFertility);
    console.log("[HandleController] type: " + type);
    if (typeof type === "undefined" || typeof ip === "undefined") {
      res.sendStatus(500);
      return;
    }
    await isMappedController(ip, macAddressGlobal);
    if (typeof knowControllerResultData === "undefined") {
      res.sendStatus(200);
      return;
    }
    if (type == "greenHouse") {
      if (
        typeof temp === "undefined" ||
        typeof humid === "undefined" ||
        typeof soilMoisture === "undefined" ||
        typeof ambientLight === "undefined"
      ) {
        res.sendStatus(500);
        return;
      }
      await saveTempGreenHouseData(ip, macAddressGlobal, temp, humid, soilMoisture, ambientLight, knowControllerResultData.farmId, knowControllerResultData.greenHouseId, knowControllerResultData.projectId);
      if (saveTempGreenHouseDataResult) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    } else if (type == "project") {
      if (typeof soilFertility === "undefined") {
        res.sendStatus(500);
        return;
      }
      await saveTempProjectData(ip, macAddressGlobal, soilFertility, knowControllerResultData.farmId, knowControllerResultData.projectId, knowControllerResultData.greenHouseId);
      if (saveTempProjectDataResult) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    }
  }
}

async function saveTempGreenHouseData(ip, piMacAddress, temperature, humidity, soilMoisture, ambientLight, farmId, greenHouseId) {
  let newTempGreenHouseData = {
    ip: ip,
    piMacAddress: piMacAddress,
    temperature: temperature,
    humidity: humidity,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
    farmId: farmId,
    greenHouseId: greenHouseId
  }
  new tempGreenHouseData(newTempGreenHouseData).save(function (err) {
    if (!err) {
      console.log("[HandleController] created new temp greenhouse data");
      saveTempGreenHouseDataResult = true;
    } else {
      console.log(err);
      saveTempGreenHouseDataResult = false;
    }
  })
}

async function saveTempProjectData(ip, piMacAddress, soilFertility, farmId, projectId, greenHouseId) {
  let newTempProjectData = {
    ip: ip,
    piMacAddress: piMacAddress,
    soilFertility: soilFertility,
    farmId: farmId,
    projectId: projectId,
    greenHouseId: greenHouseId
  }
  new tempProjectData(newTempProjectData).save(function (err) {
    if (!err) {
      console.log("[HandleController] created new temp project data");
      saveTempProjectDataResult = true;
    } else {
      console.log(err);
      saveTempProjectDataResult = false;
    }
  });
}

async function isMappedController(ip, piMacAddress) {
  console.log("[HandleController] isMappedController (ip): " + ip);
  console.log("[HandleControoler] isMappedController (piMacAddress): " + piMacAddress);
  await knowController.findOne({
    ip: ip,
    piMacAddress: piMacAddress
  }, function (err, result) {
    if (err) {
      knowControllerResultData = undefined;
      console.log("[HandleController] isMappedController (!err): " + err)
    } else if (!result) {
      knowControllerResultData = undefined;
      console.log("[HandleController] isMappedController (!result): " + result);
    } else {
      knowControllerResultData = result;
    }
  });
}