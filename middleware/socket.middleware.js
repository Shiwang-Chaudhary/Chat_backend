// const jwt = require("jsonwebtoken");
// const socketMiddleware = async(socket, next)=>{
//     try {
//         const token = socket.handshake.auth.token;
//         if (!token) {
//             return next(new Error("Authentication error"));
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         socket.user = decoded;
//         next();
//     } catch (error) {
//         next(new Error("Authentication error")); //since there is no res so we cant use res.status(400)
//     }
// }

// module.exports = socketMiddleware;

const jwt = require("jsonwebtoken");

const socketMiddleware = async (socket, next) => {
  try {
    console.log("🟡 Socket handshake auth:", socket.handshake.auth); // 👈 ADD THIS

    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("❌ Token missing");
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ JWT decoded:", decoded); // 👈 ADD THIS

    socket.user = decoded;
    next();
  } catch (error) {
    console.log("❌ JWT verify failed:", error.message); // 👈 ADD THIS
    next(new Error("Authentication error"));
  }
};

module.exports = socketMiddleware;
