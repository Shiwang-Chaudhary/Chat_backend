const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text"
    },
    content: {
        type: String,
        default: ""
        },
    fileName: {
        type: String
    },
    fileUrl: {
        type: String
    },
    fileSize: {
        type: Number
    }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);