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
        socket.on("joinroom", (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined room ${chatId}`);
        });

        //SENDING MESSAGE
        socket.on("sendMessage", async (data) => {
            //NOTE THAT ChatId and roomId means same here
            try {
                const { chatId, text } = data;
                const senderId = socket.user.id;

                const chat = await Chat.findById(chatId);
                if (!chat) {
                    return socket.emit('chat_error', 'Chat not found');
                }
                const message = await Message.create({
                    chatId,
                    sender: senderId,
                    content: text
                });
                //EMITTING MESSAGE
                io.to(chatId).emit("receiveMessage", {
                    //id: message.id,
                    // roomId: chatId,
                    // content: text,
                    // createdAt: message.createdAt
                    _id: message._id,
                    chatId: chatId,
                    content: text,
                    createdAt: message.createdAt,
                    sender: {
                        _id: senderId,
                        //name: socket.user.name || "",
                        email: socket.user.email || ""
                    }
                });

            } catch (error) {
                socket.emit("message_error", "Message sending failed: " + error.message);
            }

        })


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = initSocket;