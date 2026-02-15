const Chat = require("../modles/chat.model");
const Message = require("../modles/message.model");
const User = require("../modles/user.model");
const mongoose = require("mongoose");

const createOrGetChat = async (req, res) => {
    console.log("CreateOrGetChat API HIT ✅✅");
    try {
        const { userId } = req.body; //other person userId (OTHER)
        const myId = req.user.id; //logged user id (ME)
        let chat = await Chat.findOne({
            members: { $all: [myId, userId] },
            isGroup: { $ne: true }
        });
        if (!chat) {
            chat = await Chat.create({
                members: [myId, userId]
            });
        }
        return res.status(200).json({ Chat: chat, message: "Chat retrieved successfully. ✅✅" })
    } catch (error) {
        console.error("CreateOrGetChat error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }
};

const createGroupChat = async (req, res) => {
    console.log("createGroupChat API HIT ✅✅");
    try {
        const { name, members } = req.body;
        console.log("1st debug clear ✅✅")
        if (!name || !members || members.length < 1) {
            return res.status(400).json({
                message: "Group name and at least 2 members required"
            });
        }
        console.log("2nd debug clear ✅✅")
        const myId = req.user.id;
        const allMembers = [...new Set([...members, myId])];
        const objectIds = allMembers.map(id => new mongoose.Types.ObjectId(id));
        const chat = await Chat.create({
            name,
            isGroup: true,
            admin: new mongoose.Types.ObjectId(myId),
            members: objectIds
        });
        console.log("3rd debug clear ✅✅")
        const responseData = await Chat.findById(chat._id).populate("members", "name");
        console.log("4th debug clear ✅✅")
        return res.status(200).json({ message: "Group created successfully ✅✅", data: responseData });
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
        return res.status(500).json({ message: "Something went wrong ❌❌" });
    }
}

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
        return res.status(200).json({ message: "Message sent successfully. ✅✅", data: message });
    } catch (error) {
        console.error("SENDMESSAGE error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }
};

const getMessage = async (req, res) => {
    console.log("GET MESSAGE API HIT ✅✅");
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).populate("sender", "name email");
        // console.log("Message schema",messages);
        return res.status(200).json({
            message: "Messages fetched",
            data: messages
        });
    } catch (error) {
        console.error("GETMESSAGE error:", error);
        return res.status(500).json({ message: "Something went wrong❌❌" });
    }
};
const deleteMessage = async(req,res)=>{
    try {
        const {messageIds} = req.body;
        if (!messageIds || messageIds.length === 0) {
            return res.status(400).json({ message: "No message IDs provided" });
        }
        const deletedMessageData = await Message.deleteMany({ _id: { $in: messageIds } });
        return res.status(200).json({ message: "Messages deleted successfully", data: deletedMessageData });
    } catch (error) {
        console.error("DELETEMESSAGE error:", error);
        return res.status(500).json({ message: "Something went wrong❌❌" });
    }
}
const addMembers = async (req, res) => {
    console.log("ADD MEMBER API HIT ✅✅");
    try {
        const { chatId, members } = req.body;
        if (!members && !chatId) {
            return res.status(400).json({ message: "Please select atleast one member" });
        }
        const updatedChat = await Chat.findByIdAndUpdate(chatId,
            { $addToSet: { members } }, { new: true }
        ).populate("members", "name email");

        return res.status(200).json({
            data: updatedChat,
            message: "Member added successfully ✅✅"
        });
    } catch (error) {
        return res.status(500).json({ message: `Something went wring: ${error}` });
    }
}

const removeMember = async (req, res) => {
    console.log("REMOVE MEMBER API HIT ✅✅");
    try {
        const { chatId, memberId } = req.body;
        if (!chatId || !memberId) {
            return res.status(400).json({ message: "Both chatId and memberId are required" });
        }
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found ❌❌" });
        }
        if (chat.admin.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only admin can remove members ❌",
            });
        }
        if (chat.admin.toString() === memberId) {
            return res.status(400).json({
                message: "Admin cannot remove himself ❌",
            });
        }
        if (!chat.members.includes(memberId)) {
            return res.status(400).json({
                message: "User is not a member of this group ❌",
            });
        }
        const updatedChat = await Chat.findByIdAndUpdate(chatId,
            {
                $pull: { members: memberId }
            }
        );
        return res.status(200).json({
            message: "Member removed successfully ✅",
            data: updatedChat,
        });

    } catch (error) {
        console.log(`Error in removing member: ${error}`);
        return res.status(500).json({ message: `Something went wring: ${error}` });
    }
}

const getAllChats = async (req, res) => {
    console.log("GET ALL CHATS API HIT ✅✅");
    try {
        const loggedUser = req.user.id;
        const { isGroup } = req.query;
        const filter = {
            members: loggedUser
        }
        if (isGroup === "true") {
            filter.isGroup = true;
        } else {
            filter.isGroup = { $ne: true }; // $ne means not equal 
            // and it give all the chats that are not true and it includes those chats as well where isGroup key doesn't even exist...
            //and its better than just defining filter.isGroup = false
        }
        const chats = await Chat.find(filter).populate("members", "name email").populate("admin", "name email").sort("-updatedAt");
        return res.status(200).json({
            message: "Chats fetched",
            data: chats
        });
    } catch (error) {
        console.error("GETALLCHATS error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }
}

const searchUsers = async (req, res) => {
    console.log("SEARCH USERS API HIT ✅✅");
    try {
        const { query } = req.query;
        const myId = req.user.id;
        if (!query) {
            return res.status(400).json({ message: "query is required" });

        }
        const users = await User.find({
            _id: { $ne: myId },
            name: { $regex: `^${query}`, $options: "i" }
        }).select("id name email").sort({ updatedAt: -1 });

        return res.status(200).json({
            message: "Users fetched",
            data: users
        });
    } catch (error) {
        console.error("SEARCH USERS error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }
}
const searchgroups = async (req, res) => {
    console.log("SearchGroups API HIT ✅✅")
    try {
        const { query } = req.query;
        const myId = req.user.id;
        if (!query) {
            return res.status(400).json({ message: "query is required" });
        }
        const groups = await Chat.find({
            isGroup: true,
            members: myId,
            name: { $regex: `^${query}`, $options: "i" }
        }).populate("admin", "name email").sort({ updatedAt: -1 });
        res.status(200).json({
            message: "Users fetched",
            data: groups
        });
    } catch (error) {
        console.error("SEARCH USERS error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }

}

module.exports = { createOrGetChat, sendMessage, getMessage, getAllChats, searchUsers, createGroupChat, searchgroups, addMembers, removeMember, deleteMessage };