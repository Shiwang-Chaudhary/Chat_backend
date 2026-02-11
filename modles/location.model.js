const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    latitude: Number,
    longitude: Number,
}, {timestamps: true});

module.exports = mongoose.model("Location",locationSchema);