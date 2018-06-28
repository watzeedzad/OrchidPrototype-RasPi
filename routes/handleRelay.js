var express = require("express");
var router = express.Router();

import HandleRelay from "../classes/HandleRelay"

router.post("/", function(req, res) {
    new HandleRelay(req, res);
});

module.exports = router;