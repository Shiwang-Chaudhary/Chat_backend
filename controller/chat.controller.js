const Chat = require("../modles/chat.model");
const Message = require("../modles/message.model");

const createOrGetChat = async (req, res) => {
    // Logic for creating or getting a chat
    console.log("CreateOrGetChat API HIT ✅✅");
    try {
        const { userId } = req.body;//other person userId (OTHER)
        const myId = req.user.id;//logged user id (ME)
        let chat = await Chat.findOne({
            members: { $all: [myId, userId] }
        });
        if (!chat) {
            chat = await Chat.create({
                members: [myId, userId]
            });
        }
        res.status(200).json({ Chat: chat, message: "Chat retrieved successfully. ✅✅" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("CreateOrGetChat error:", error);
    }
};

const sendMessage = async (req, res) => {
    // Logic for sending a message
    console.log("SENDMESSAGE API HIT ✅✅");
    try {
        const { chatId, content } = req.body;
        const senderId = req.user.id;
        const message = await Message.create({
            chatId,
            sender: senderId,
            content
        });

        res.status(200).json({ message: "Message sent successfully. ✅✅", data: message });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("SENDMESSAGE error:", error);
    }
};

const getMessage = async (req, res) => {
    // Logic for getting a message
    console.log("GET MESSAGE API HIT ✅✅");
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).populate("sender", ["name", "email"]);
        res.status(200).json({
            message: "Messages fetched",
            data: messages
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("GETMESSAGE error:", error);
    }
};

const getAllChats = async(req,res)=>{
    console.log("GET ALL CHATS API HIT ✅✅");
    try {
        const loggedUser = req.user.id;
        const chats = await Chat.find({members: loggedUser}).populate("members","name email").sort("-updatedAt");
        res.status(200).json({
            message: "Chats fetched",
            data: chats
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("GETALLCHATS error:", error);
    }
}

module.exports = { createOrGetChat, sendMessage, getMessage, getAllChats };