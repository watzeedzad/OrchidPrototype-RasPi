const mongoose = require("mongoose");
const macAddr = require("getmac");
const relayQueue = mongoose.model("relay_queue");
const request = require("request");

var relayQueueData;

export default class GetRalayQueueData {
    constructor() {
        this.operation();
    }

    async operation() {
        await getRelayQueueData(macAddressGlobal);
        console.log("[GetRelayQueueData] rawResult: " + relayQueueData);
        for (let index = 0; index <= relayQueueData.length; index++) {
            if (index == relayQueueData.length) {
                console.log("[GetRelayQueueData] last loop reach at index " + index);
                // removeRelayQueue(macAddressGlobal);
            } else {
                let ip = relayQueueData[index].ip;
                let type = relayQueueData[index].pumpType;
                let command = relayQueueData[index].command;
                onOffPump(ip, command, type);
            }
        }
    }
}

async function getRelayQueueData(macAddress) {
    let result = await relayQueue.find({
            macAddress: macAddress
        }, {}, {
            sort: {
                _id: 1
            }
        },
        (err, result) => {
            if (err) {
                console.log("[GetRelayQueueData] getRelayQueueData, Query Failed!");
                relayQueueData = undefined;
            } else {
                relayQueueData = result;
            }
        }
    );
}

function removeRelayQueue(macAddress) {
    relayQueue.remove({
            macAddress: macAddress
        },
        err => {
            if (err) {
                console.log("[GetRelayQueueData] removeRelayQueue, delete failed!");
            } else {
                console.log("[GetRelayQueueData] removeRelayQueue, delete successful!");
            }
        }
    );
}

function onOffPump(ip, state, type) {
    let urlPart = "";
    if (type == "water") {
        urlPart = "/waterPump";
    } else if (type == "fertilizer") {
        urlPart = "/fertilizerPump";
    } else if (type == "moisture") {
        urlPart = "/moisturePump";
    }
    let command = 0;
    () => {
        if (state) {
            command = 0;
        } else {
            command = 1;
        }
    };
    console.log(
        "[GetRelayQueueData] url: " +
        "http://" +
        String(ip) +
        urlPart +
        "?params=" +
        command
    );
    request
        .get("http://" + String(ip) + urlPart + "?params=" + command, {
            timeout: 20000
        })
        .on("error", err => {
            console.log(err.code === "ETIMEDOUT");
            console.log(err.connect === true);
            console.log(err);
        });
}