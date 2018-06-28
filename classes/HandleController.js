var request = require("request");

let sendStatus;

export default class HandleController {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
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
      await sendGreenHouseRequest(
        ip,
        tmep,
        humid,
        soilMoisture,
        ambientLight
      );
    } else if (type == "project") {
      if (typeof soilFertilizer === "undefined") {
        res.sendStatus(500);
        return;
      }
      await sendProjectRequest(ip, soilFertilizer);
    }
    
  }
}

function sendGreenHouseRequest(
  address,
  temp,
  humid,
  soilMoisture,
  ambientLight
) {
  var greenHouseData = {
    temperature: temp,
    humidity: humid,
    soilMoisture: soilMoisture,
    ambientLight: ambientLight,
    ip: address,
    host: DDNS
  };
  request.post({
      url: DDNS + "/sensorRoutes/greenHouseSensor",
      form: greenHouseData
    },
    function (err, httpResponse, body) {
      if (!err) {
        sendStatus = 200;
        console.log("[HandleController] httpResponse: " + httpResponse);
      } else {
        sendStatus = 500;
        console.log("[HandleController] httpResponse: " + httpResponse);
        console.log("[HandleController] err: " + err);
      }
    }
  );
}

function sendProjectRequest(address, soilFertilizer) {
  var projectData = {
    soilFertilizer: soilFertilizer,
    ip: address,
    host: DDNS
  };
  request.post({
      url: DDNS + "/sensorRoutes/projectSensor",
      form: greenHouseData
    },
    function (err, httpResponse, body) {
      if (!err) {
        sendStatus = 200;
        console.log("[HandleController] httpResponse: " + httpResponse);
      } else {
        sendStatus = 500;
        console.log("[HandleController] httpResponse: " + httpResponse);
        console.log("[HandleController] err: " + err);
      }
    }
  );
}