const express = require("express");
const router = express.Router();
const {createOrGetChat, sendMessage, getMessage, getAllChats, searchUsers, createGroupChat, searchgroups, addMembers, removeMember, deleteMessage} = require("../controller/chat.controller");
const authMiddleware = require("../middleware/auth.middlware");

router.post("/createOrGet", authMiddleware, createOrGetChat);
router.post("/sendMessage", authMiddleware, sendMessage);
router.get("/getMessage/:chatId", authMiddleware, getMessage);
router.get("/getAllChats", authMiddleware, getAllChats);
router.get("/searchUsers", authMiddleware, searchUsers);
router.post("/createGroupChat",authMiddleware, createGroupChat);
router.get("/searchGroups",authMiddleware, searchgroups);
router.patch("/addMembers",authMiddleware, addMembers);
router.delete("/removeMember",authMiddleware, removeMember);
router.delete("/deleteMessages", authMiddleware, deleteMessage);

module.exports = router;
