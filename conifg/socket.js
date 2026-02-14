const { Server } = require("socket.io");
const socketMiddleware = require("../middleware/socket.middleware");
const Chat = require("../modles/chat.model");
const Message = require("../modles/message.model");
const Location = require("../modles/location.model");

//INITIALIZING SOCKET
const initSocket = async (server) => {
    const io = new Server(server, { cors: { origin: "*" } });


    io.use(socketMiddleware);

    //CONNECTING USER
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        const userId = socket.user.id;
        console.log("👤 User ID:", userId);
        socket.join(userId);
        console.log("🏠 Rooms of", userId, "=>", socket.rooms);


        //JOINING ROOM
        socket.on("joinroom", async (chatId) => {
            console.log("Join room called")
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
                if (messageType === "text" && !text) {
                    return socket.emit("message_error", "Text message cannot be empty");
                }
                console.log("1st condition clear ✅✅")
                if (messageType !== "text" && (!fileSize || !fileUrl)) {
                    return socket.emit("message_error", "File URL and File Size are required for file messages");
                }
                console.log("2nd condition clear ✅✅")
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    console.log("Chat error");
                    return socket.emit('chat_error', 'Chat not found');
                }
                console.log("3rd condition clear ✅✅")
                const isMember = chat.members.some((member) => member.toString() === senderId.toString());
                if (!isMember) {
                    console.log("Member error");
                    return socket.emit("member_error", "member not found");
                }
                console.log("4th condition clear ✅✅")
                const message = await Message.create({
                    chatId,
                    sender: senderId,
                    messageType,
                    fileName: fileName,
                    fileUrl: fileUrl,
                    fileSize: fileSize,
                    content: text || ""
                });
                console.log("5th condition clear ✅✅")
                const populatedMessage = await Message.findById(message._id)
                    .populate("sender", "name email");
                //EMITTING MESSAGE
                io.to(chatId).emit("receiveMessage", populatedMessage);
                console.log("6th condition clear ✅✅")
                console.log("SOCKET.USER.name: ", socket.user.name);

            } catch (error) {
                console.log("Error in sending message: " + error.message);
                return socket.emit("message_error", "Message sending failed: " + error.message);
            }

        });

        socket.on("updateLocation", async (data) => {
            try {
                const userId = socket.user.id;
                await Location.findOneAndUpdate(
                    { user: userId },
                    { longitude: data.longitude, latitude: data.latitude },
                    { upsert: true, new: true });
                console.log("📍 Location updated:", userId);

                //Only broadcast the location to friends which you have chatted with (personal chat only).
                const chats = await Chat.find({ isGroup: false, members: userId });
                if (!chats) {
                    return socket.emit("location-error", "Chat not found for user");
                }
                let friendIds = new Set();
                //extract memberId(friendId) from chatModel
                chats.forEach((chat) => {
                    chat.members.forEach((m) => {
                        const fid = m.toString(); // ✅ force string

                        if (fid !== userId.toString()) {
                            friendIds.add(fid);
                        }
                    });
                });
                //send the location update to the friend
                friendIds.forEach((fid) => {
                    io.to(fid).emit("friendLocationUpdate", {
                        user: userId,
                        longitude: data.longitude,
                        latitude: data.latitude,
                    });
                });
                console.log("📡 Location broadcasted to friends:", friendIds.size);

            } catch (error) {
                console.log("❌ Error in updateLocation:", error.message);

            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = initSocket;