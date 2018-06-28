var express = require("express");
var router = express.Router();

import HandleController from "../classes/HandleController"

router.post("/", function(req, res) {
    new HandleController(req, res);
});

module.exports = router;