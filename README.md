# 🚀 Chat Backend with Live Location Sharing

This is the backend server for a real-time chat application built with **Node.js + Express + MongoDB**.  
It supports **real-time messaging**, **JWT authentication**, **live location updates**, **group chats**, and **file sharing** using **Socket.IO**.

This backend works together with the Flutter frontend application.

---

## ✨ Features

- User Authentication (Register/Login) using JWT
- Secure Password Hashing with Bcrypt
- Real-time Chat Messaging with Socket.IO
- Live Location Sharing for Online Friends
- Store Last Known Location for Offline Users
- Group Chat Support
- File Upload & Sharing (Images, Video, Audio, Documents)
- REST API + WebSocket Integration
- MongoDB Database Storage

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Socket.IO**
- **JWT Authentication**
- **Multer (File Uploads)**
- **Bcrypt.js (Password Hashing)**

---

## 📂 Project Structure
Chat_backend/
│── 
config/
│ ├── dbConnection.js # MongoDB connection setup
│ └── socket.js # Socket.IO configuration
│
│── controller/
│ ├── auth.controller.js # Login/Register logic
│ ├── chat.controller.js # Chat message handling
│ └── location.controller.js# Location update logic
│
│── middleware/
│ ├── auth.middleware.js # JWT authentication middleware
│ └── socket.middleware.js # Socket authentication middleware
│
│── models/
│ ├── user.model.js # User schema
│ ├── message.model.js # Message schema
│ ├── chat.model.js # Chat schema
│ └── location.model.js # Location schema
│
│── routes/
│ ├── auth.routes.js # Auth routes
│ ├── chat.routes.js # Chat routes
│ └── location.routes.js # Location routes
│
│── server.js # Main server entry point
│── .env # ADD THIS FILE ACCORDING TO YOUR KEYS
│── package.json
│── README.md

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/Shiwang-Chaudhary/Chat_backend.git
cd Chat_backend

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a .env file in the root directory:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

### 4. Run the Server
node server.js
//SERVER WILL RUN AT PORT 3000

## Frontend Repository

Flutter frontend for this backend:

 https://github.com/Shiwang-Chaudhary/Chat_frontend




