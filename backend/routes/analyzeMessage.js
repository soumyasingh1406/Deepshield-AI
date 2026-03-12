const express = require("express");
const router = express.Router();
const { analyzeMessage } = require("../controllers/messageController");

router.post("/", analyzeMessage);

module.exports = router;
