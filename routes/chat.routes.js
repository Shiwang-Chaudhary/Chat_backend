const express = require("express");
const router = express.Router();

router.post("/createOrGet",createOrGetChat);
router.post("/message",sendMessage);
router.post("/createOrGet",getMessage);

module.exports = router;
