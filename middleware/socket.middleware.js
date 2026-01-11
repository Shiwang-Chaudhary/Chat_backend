const jwt = require("jsonwebtoken");
const socketMiddleware = async(socket, next)=>{
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error("Authentication error")); //since there is no res so we cant use res.status(400)
    }
}

module.exports = socketMiddleware;