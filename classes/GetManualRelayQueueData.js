const mongoose = require("mongoose");
const relayManualQueue = mongoose.model("relay_manual_queue")
const request = require("request");

let relayManualQueueData;

export default class GetManualRelayQueueData {
    constructor() {
        this.operation();
    }

    async operation() {
        await getManualRelayQueueData(macAddressGlobal);
        console.log("[GetManualRelayQueueData] rawResult: " + relayManualQueueData);
        for (let index = 0; index <= relayManualQueueData.length; index++) {
            if (index == relayManualQueueData.length) {
                console.log("[GetManualRelayQueueData] last loop reach at index " + index);
                removeRelayQueue(macAddressGlobal);
            } else {
                let ip = relayManualQueueData[index].ip;
                let type = relayManualQueueData[index].pumpType;
                let litre = relayManualQueueData[index].inputLitre;
                manualPump(ip, type, litre);
            }
        }
    }
}

async function getManualRelayQueueData(macAddress) {
    console.log("[GetManualRelayQueueData] getManualRelayQueueData: " + macAddress);
    await relayManualQueue.find({
            piMacAddress: macAddress
        }, {}, {
            sort: {
                _id: 1
            }
        },
        (err, result) => {
            if (err) {
                console.log("[GetRelayQueueData] getRelayQueueData (err): " + err);
                relayManualQueueData = undefined;
            } else if (!result) {
                console.log("[GetRelayQueueData] getRelayQueueData (!result): " + result);
                relayManualQueueData = undefined;
            } else {
                relayManualQueueData = result;
            }
        }
    );
}

function removeRelayQueue(macAddress) {
    relayManualQueue.remove({
            piMacAddress: macAddress
        },
        (err) => {
            if (err) {
                console.log("[GetManualRelayQueueData] removeRelayQueue, delete failed!");
            } else {
                console.log("[GetManualRelayQueueData] removeRelayQueue, delete successful!");
            }
        }
    );
}

function manualPump(ip, type, litre) {
    let urlPart = "";
    if (type == "water") {
        urlPart = "/manualWater";
    } else if (type == "fertilizer") {
        urlPart = "/manualFertilizer";
    } else if (type == "moisture") {
        urlPart = "/manualMoisture";
    }
    let url = "http://" + String(ip) + urlPart + "?params=" + litre;
    console.log("[GetRelayQueueData] url: " + url);
    request.get(
        url, {
            timeout: 20000
        },
        function (error, response, body) {
            console.log("[GetManualRelayQueueData] onOffPump " + "(" + type + ") " + "(error) " + error);
            console.log("[GetManualRelayQueueData] onOffPump " + "(" + type + ") " + "(response) " + response);
            console.log("[GetManualRelayQueueData] onOffPump " + "(" + type + ") " + "(body) " + body);
        });
}