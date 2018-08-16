const mongoose = require("mongoose");
const relayManualQueue = mongoose.model("")
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
                // removeRelayQueue(macAddressGlobal);
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
    await relayManualQueue.find({
            macAddress: macAddress
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
    relayQueue.remove({
            macAddress: macAddress
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
    console.log(
        "[GetRelayQueueData] url: " +
        "http://" +
        String(ip) +
        urlPart +
        "?params=" +
        litre
    );
    request
        .get("http://" + String(ip) + urlPart + "?params=" + litre, {
            timeout: 20000
        })
        .on("error", err => {
            console.log(err.code === "ETIMEDOUT");
            console.log(err.connect === true);
            console.log(err);
        });
}