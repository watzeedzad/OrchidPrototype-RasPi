let request = require("request");

let sendStatus;

export default class HandleRelayManual {
    constructor(req, res) {
        this.process(req, res);
    }

    async process(req, res) {
        let ip = req.body.ip;
        let inputLitre = req.body.litre;
        let type = req.body.type;
        if (typeof ip === "undefined" || typeof duration === "undefined" || typeof type === "undefined") {
            res.sendStatus(500);
            return;
        }
        await sendCommand(ip, inputLitre, type);
        if (sendStatus == 200) {
            res.sendStatus(200);
            return;
        }
        if (sendStatus == 500) {
            res.sendStatus(500);
            return;
        }
    }
}

function sendCommand(address, inputLitre, type) {
    await request
        .get("http://" + String(address) + "/" + String(type) + "?params=" + String(inputLitre), {
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