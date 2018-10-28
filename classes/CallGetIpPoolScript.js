import {PythonShell} from "python-shell";

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
        scriptPath: "/"
    }

    PythonShell.run("getIpPool.py", pythonOption, function (err, result) {
        if (err) throw err;
        console.log("[CallGetIpPoolScript] result: " + result);
    });
}
