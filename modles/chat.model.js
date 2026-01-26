const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.isGroup === true;
        },
        trim: true,
    },
    isGroup: { type: Boolean, default: false },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () { return this.isGroup === true }
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);