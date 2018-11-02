import {
    PythonShell
} from "python-shell";
const request = require("request");

export default class CallGetIpPoolScript {
    constructor() {
        operation()
    }
}

async function operation() {
    let pythonOption = {
        mode: "text",
        pythonPath: "/usr/bin/python",
        pythonOptions: ["-u"],
        scriptPath: "/"
    }

    PythonShell.run("getIpPool.py", pythonOption, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            return;
        }
        console.log("[CallGetIpPoolScript] result: " + result);
        let sendDataUrl = server_host + "/dynamicControllerHandle"
        request.post({
            url: sendDataUrl,
            body: {
                ipPoolData: result,
                piMacAddress: macAddressGlobal
            },
            json: true
        }, function (err, res, body) {
            console.log("[CallGetIpPoolScript] sendData (err): " + err);
            console.log("[CallGetIpPoolScript] sendData (res): " + res);
            console.log("[CallGetIpPoolScript] sendData (body): " + body);
        });
    });
}