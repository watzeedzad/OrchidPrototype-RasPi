// var request = require("request");

// let sendStatus;

// export default class HandleController {
//   constructor(req, res) {
//     this.process(req, res);
//   }

//   async process(req, res) {
//     let ip = req.body.ip;
//     let temp = req.body.temperature;
//     let humid = req.body.humidity;
//     let soilMoisture = req.body.soilMoisture;
//     let ambientLight = req.body.ambientLight;
//     let soilFertilizer = req.body.soilFertilizer;
//     let type = req.body.type;
//     if (typeof type === "undefined") {
//       res.sendStatus(500);
//       return;
//     }
//     if (type == "greenHouse") {
//       if (
//         typeof temp === "undefined" ||
//         typeof humid === "undefined" ||
//         typeof soilMoisture === "undefined" ||
//         typeof ambientLight === "undefined"
//       ) {
//         res.sendStatus(500);
//         return;
//       }
//       await sendGreenHouseRequest(
//         ip,
//         tmep,
//         humid,
//         soilMoisture,
//         ambientLight
//       );
//     } else if (type == "project") {
//       if (typeof soilFertilizer === "undefined") {
//         res.sendStatus(500);
//         return;
//       }
//       await sendProjectRequest(ip, soilFertilizer);
//     }

//   }
// }

// function sendGreenHouseRequest(
//   address,
//   temp,
//   humid,
//   soilMoisture,
//   ambientLight
// ) {
//   var greenHouseData = {
//     temperature: temp,
//     humidity: humid,
//     soilMoisture: soilMoisture,
//     ambientLight: ambientLight,
//     ip: address,
//     macAddress: macAddressGlobal
//   };
//   request.post({
//       url: server_host + "/sensorRoutes/greenHouseSensor",
//       form: greenHouseData
//     },
//     function (err, httpResponse, body) {
//       if (!err) {
//         sendStatus = 200;
//         console.log("[HandleController] httpResponse: " + httpResponse);
//       } else {
//         sendStatus = 500;
//         console.log("[HandleController] httpResponse: " + httpResponse);
//         console.log("[HandleController] err: " + err);
//       }
//     }
//   );
// }

// function sendProjectRequest(address, soilFertilizer) {
//   var projectData = {
//     soilFertilizer: soilFertilizer,
//     ip: address,
//     macAddress: macAddressGlobal
//   };
//   request.post({
//       url: DDNS + "/sensorRoutes/projectSensor",
//       form: greenHouseData
//     },
//     function (err, httpResponse, body) {
//       if (!err) {
//         sendStatus = 200;
//         console.log("[HandleController] httpResponse: " + httpResponse);
//       } else {
//         sendStatus = 500;
//         console.log("[HandleController] httpResponse: " + httpResponse);
//         console.log("[HandleController] err: " + err);
//       }
//     }
//   );
// }
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
    let soilFertilizer = req.body.soilFertilizer;
    let type = req.body.type;
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
      await saveTempGreenHouseData(ip, macAddressGlobal, temp, humid, soilMoisture, ambientLight, knowControllerResultData.farmId, knowControllerResultData.greenHouseId);
      if (saveTempGreenHouseDataResult) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    } else if (type == "project") {
      if (typeof soilFertilizer === "undefined") {
        res.sendStatus(500);
        return;
      }
      await saveTempProjectData(ip, macAddressGlobal, soilFertilizer, knowControllerResultData.farmId, knowControllerResultData.projectId);
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

async function saveTempProjectData(ip, piMacAddress, soilFertilizer, farmId, projectId) {
  let newTempProjectData = {
    ip: ip,
    piMacAddress: piMacAddress,
    soilFertilizer: soilFertilizer,
    farmId: farmId,
    projectId: projectId
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