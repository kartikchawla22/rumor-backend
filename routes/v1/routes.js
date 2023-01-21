const express = require("express");
const router = express.Router();
const controller = require("../../controllers/controller");

router.get('/getImages', controller.getImages)

module.exports = router;