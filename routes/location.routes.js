const express = require("express");
const router = express.Router();
const {getFriendlocation} = require("../controller/location.controller");
const authMiddleware = require("../middleware/auth.middlware");


router.get("/friendLocation",authMiddleware,getFriendlocation);

module.exports = router;
