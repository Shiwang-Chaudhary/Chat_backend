const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({},{timestamps: true});

module.exports = mongoose.model("Message", messageSchema);