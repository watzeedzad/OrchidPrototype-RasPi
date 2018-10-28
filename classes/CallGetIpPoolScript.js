const pythonShell = require("python-shell");

export default class CallGetIpPoolScript {
    constructor(){
        operation()
    }
}

async function operation() {
    let pythonOption = {
        mode: "text",
        pythonPath: "/usr/bin/python",
        pythonOptions: ["-u"],
        scriptPath: "../python"
    }

    pythonShell.run("getIpPool.py", pythonOption, function (err, result) {
        if (err) {
            console.log("[CallGetIpPoolScript] err: " + err);
            return;
        }
        console.log("[CallGetIpPoolScript] result: " + result);
    });
}