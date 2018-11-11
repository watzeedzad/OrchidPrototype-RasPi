const mongoose = require("mongoose");
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
                removeRelayQueue(macAddressGlobal);
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
    console.log("[GetRelayQueueData] getRelayQueueData: " + macAddress);
    await relayQueue.find({
            piMacAddress: macAddress
        }, {}, {
            sort: {
                _id: 1
            }
        },
        (err, result) => {
            if (err) {
                console.log("[GetRelayQueueData] getRelayQueueData (err): " + err);
                relayQueueData = undefined;
            } else if (!result) {
                console.log("[GetRelayQueueData] getRelayQueueData (!result): " + result);
                relayQueueData = undefined;
            } else {
                relayQueueData = result;
            }
        }
    );
}

function removeRelayQueue(macAddress) {
    relayQueue.remove({
            piMacAddress: macAddress
        },
        (err) => {
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
    } else if (type == "light") {
        urlPart = "/light"
    }
    let command = 0;
    if (state) {
        command = 0;
    } else {
        command = 1
    }
    let url = "http://" + String(ip) + urlPart + "?params=" + command;
    console.log("[GetRelayQueueData] url: " + url);
    request.get(
        url, {
            timeout: 20000
        },
        function (error, response, body) {
            console.log("[GetRelayQueueData] onOffPump " + "(" + type + ") " + "(error) " + error);
            console.log("[GetRelayQueueData] onOffPump " + "(" + type + ") " + "(response) " + response);
            console.log("[GetRelayQueueData] onOffPump " + "(" + type + ") " + "(body) " + body);
        });
}