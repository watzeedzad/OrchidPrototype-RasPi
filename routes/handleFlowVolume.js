var express = require("express");
var router = express.Router();

import HandleFlowVolume from "../classes/HandleFlowVolume"

router.post("/", function(req, res) {
    new HandleFlowVolume(req, res);
});

module.exports = router;