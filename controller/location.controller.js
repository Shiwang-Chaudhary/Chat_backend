const Chat = require("../modles/chat.model");
const Location = require("../modles/location.model");
const getFriendlocation = async (req, res) => {
    try {
        const myId = req.user.id;
        const chats = await Chat.find({
            isGroup: false,
            members: myId
        }).populate("members", "name");
        console.log("GetFriendLocation chat:", chats);
        let friendIds = new Set();
        chats.forEach((chat) => {
            chat.members.forEach((m) => {
                if (m._id.toString() !== myId) {
                    friendIds.add(m._id.toString());
                }
            });
        });
        console.log("Friends IDs:", friendIds);
        const location = await Location.find({
            user: { $in: Array.from(friendIds) }
        }).populate("user", "name");
        console.log("GetFriendLocation locations:", location);
        return res.status(200).json({message:"Location fetched successfully",data:location});
    } catch (error) {
        console.error("GetFriendLocation error:", error);
        return res.status(500).json({ message: "Something went wrong.❌❌" });
    }
}
module.exports = { getFriendlocation };