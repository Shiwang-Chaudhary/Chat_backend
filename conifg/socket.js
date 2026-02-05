const { Server } = require("socket.io");
const socketMiddleware = require("../middleware/socket.middleware");
const Chat = require("../modles/chat.model");
const Message = require("../modles/message.model");

//INITIALIZING SOCKET
const initSocket = async (server) => {
    const io = new Server(server, { cors: { origin: "*" } });

    io.use(socketMiddleware);

    //CONNECTING USER
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        //JOINING ROOM
        socket.on("joinroom", async (chatId) => {
            try {
                const userId = socket.user.id;
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    return socket.emit("Error", "Chat not found");
                }
                const isMember = chat.members.some((member) => member.toString() === userId);
                if (!isMember) {
                    return socket.emit(
                        "chat_error",
                        "You are not a member of this chat"
                    );
                }
                socket.join(chatId);
                console.log(`User ${socket.id} joined room ${chatId}`);
            } catch (error) {
                socket.emit("chat_error", "Failed to join room");
            }

        });

        //SENDING MESSAGE
        socket.on("sendMessage", async (data) => {
            //NOTE THAT ChatId and roomId means same here
            console.log("SEND MESSAGE SOCKET CALLED ✅✅")
            try {
                const { chatId, text, messageType, fileName, fileUrl, fileSize } = data;
                const senderId = socket.user.id;
                if (messageType==="text" && !text) {
                    return socket.emit("message_error", "Text message cannot be empty");
                }
                if (messageType==="file" && (!fileSize || !fileUrl)) {
                    return socket.emit("message_error", "File URL and File Size are required for file messages");
                }
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    console.log("Chat error");
                    return socket.emit('chat_error', 'Chat not found');
                }
                const isMember = chat.members.some((member) => member.toString() === senderId.toString());
                if (!isMember) {
                    console.log("Member error");
                    return socket.emit("member_error", "member not found");
                }
                const message = await Message.create({
                    chatId,
                    sender: senderId,
                    messageType,
                    fileName:fileName,
                    fileUrl:fileUrl,
                    fileSize:fileSize,
                    content: text || ""
                });
                const populatedMessage = await Message.findById(message._id)
                    .populate("sender", "name email");
                //EMITTING MESSAGE
                io.to(chatId).emit("receiveMessage", populatedMessage);
                console.log("SOCKET.USER.name: ", socket.user.name);

            } catch (error) {
                console.log("Error in sending message: " + error.message);
                socket.emit("message_error", "Message sending failed: " + error.message);
            }

        })


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = initSocket;