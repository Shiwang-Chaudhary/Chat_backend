const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
// const { Server } = require("socket.io");
const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });
const authRoutes = require("./routes/auth.routes");
const connectDB = require("./conifg/dbConnection");
const chatRoutes = require("./routes/chat.routes");
const locationRoutes = require("./routes/location.routes");
const initSocket = require("./conifg/socket"); 
require('dotenv').config();


connectDB();

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", authRoutes);
app.use('/chat', chatRoutes);
app.use("/location",locationRoutes);

initSocket(server);
// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("joinRoom", (roomId) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room ${roomId}`);
//     });

//     socket.on("sendMessage", (data) => {
//         console.log("Message received:", data);
//         socket.to(data.roomId).emit("receiveMessage", data);

//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
//});

//TEST COMMIT
server.listen(port, () => {
    console.log(`Chat backend is running on port: ${port}`);
});
