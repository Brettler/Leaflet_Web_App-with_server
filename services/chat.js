const Chat = require('../models/chat');

const getChats = async (userId) => {
    console.log("getChats called with userId: ", userId); // Log entry to the function
    try {
        console.log("Attempting to fetch chats for user: ", userId);
        const chats = await Chat.find({participants: userId}).populate({
            path: 'messages',
            options: { sort: { 'created': -1 }, limit: 1 },
            populate: { path: 'sender' }
        });
        console.log("Fetched chats: ", chats); // Log the fetched chats
        return chats;
    } catch (err) {
        console.error("Error fetching chats: ", err); // More detailed error log
        throw err;
    }
};



const registerModel = require('../models/register')
const createChat = async (username, userId) => {
    try {
        console.log("createChat in service called with: ", username, userId);
        // Find the friend in the database.
        const friend = await registerModel.findOne({username: username});

        // If the friend is not found, throw an error.
        if (!friend) {
            throw new Error('Friend not found');
        }

        // Create a new chat with the authenticated user and the friend.
        const chat = new Chat({participants: [userId, friend._id]});

        // Save the chat to the database and return it.
        const newChat = await chat.save();
        console.log("Chat created: ", newChat);
        console.log("Friend: ", friend);

        // Now add the new chat to both the user and the friend's list of chats.
        const user = await registerModel.findByIdAndUpdate(
            userId,
            { $push: { chats: newChat._id } },
            { new: true, useFindAndModify: false }
        );
        await registerModel.findByIdAndUpdate(
            friend._id,
            { $push: { chats: newChat._id } },
            { new: true, useFindAndModify: false }
        );

        // Return the chat and the friend.
        return {chat: newChat, friend: friend};
    } catch (err) {
        console.error("Error while creating chat", err);
        throw new Error('Error while creating chat');
    }
};






module.exports = {getChats, createChat};
