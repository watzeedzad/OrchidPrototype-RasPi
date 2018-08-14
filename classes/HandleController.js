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

let knowControllerResultData;

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
    if (typeof type === "undefined") {
      res.sendStatus(500);
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
    } else if (type == "project") {
      if (typeof soilFertilizer === "undefined") {
        res.sendStatus(500);
        return;
      }
    }
  }
}

async function saveTempGreenHouseData(ip, piMacAddress, temperature, humidity, soilMoisture, ambientLight) {
  let newTempGreenHouseData = {
    ip: ip,
    piMacAddress: piMacAddress,
    temperature: temperature,
    humidity: humidity,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
  }
  new tempGreenHouseData(newTempGreenHouseData).save(function (err) {
    if (!err) {
      console.log("[HandleController] created new temp greenhouse data");
    } else {
      return console.log(err);
    }
  })
}

async function saveTempProjectData(ip, piMacAddress, soilFertility) {
  let newTempProjectData = {
    ip: ip,
    piMacAddress: piMacAddress,
    soilFertility: soilFertility
  }
  new tempProjectData(newTempProjectData).save(function (err) {
    if (!err) {
      console.log("[HandleController] created new temp project data");
    } else {
      return console.log(err);
    }
  });
}