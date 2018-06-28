var request = require("request");

let sendStatus;

export default class HandleRelay {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        let ip = req.body.ip;
        let relayCommand = req.body.relayCommand;
        let type = req.body.type;
        if (typeof ip === "undefined" || typeof relayCommand === "undefined" || typeof type === "undefined") {
            res.sendStatus(500);
            return;
        }
        await sendCommand(ip, relayCommand, type);
        if (sendStatus == 200) {
            res.sendStatus(200);
        }
        if (sendStatus == 500) {
            res.sendStatus(500);   
        }
    }
}

async function sendCommand(address, relayCommand, type) {
    await request
        .get("http://" + String(address) + "/" + String(type) + "?params=" + String(relayCommand), {
            timeout: 20000
        })
        .on("error", function (err) {
            console.log(err.code === "ETIMEDOUT");
            console.log(err.connect === true);
            console.log(err);
            sendStatus = 500;
        });
    sendStatus = 200;
}