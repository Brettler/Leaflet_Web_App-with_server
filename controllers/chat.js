const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

const chatService = require('../services/chat');
const messageModel = require('../models/message'); // Modify the path according to your project structure
const registerModel = require('../models/register');
const chatModel = require('../models/chat'); // Modify the path according to your project structure

const getChats = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token: ", token);

        try {
            const decoded = jwt.verify(token, key);
            console.log("decoded value is : ", decoded)

            const user = await registerModel.findOne({username: decoded.username});
            console.log("User retrieved in getChats: ", user);

            const rawChats = await chatService.getChats(user._id);

            if (rawChats) {
                console.log("Chats found, sending status 200");

                const chats = await Promise.all(rawChats.map(async chat => {
                    // Get the other participant
                    const friendId = chat.participants.find(id => !id.equals(user._id));
                    const friend = await registerModel.findById(friendId);

                    // Get the last message
                    const lastMessage = chat.messages.length > 0 ? await messageModel.findById(chat.messages[chat.messages.length - 1]) : null;

                    return {
                        id: chat._id,
                        user: {
                            username: friend.username,
                            displayName: friend.displayName,
                            profilePic: friend.profilePic
                        },
                        lastMessage: lastMessage ? {
                            id: lastMessage._id,
                            created: lastMessage.created,
                            content: lastMessage.content
                        } : null
                    };
                }));

                console.log("Sending back to the client : ", chats)
                res.status(200).json(chats);
            } else {
                console.log("No chats found, sending status 404");
                res.status(404).send('Chats not found!');
            }
        } catch (err) {
            console.log("Error occurred: ", err);
            return res.status(401).send("Invalid Token");
        }
    } else {
        console.log("No Authorization header found, sending status 403");
        return res.status(403).send('Token required');
    }
};



const createChat = async (req, res) => {
    console.log("createChat Function is starting");
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, key);
            console.log("Token verified");
        } catch(err) {
            console.log("Token verification failed: ", err.message);
        }

        if (!decoded) {
            console.log("Token could not be decoded.");
            return res.status(401).send("Invalid Token");
        }
        console.log("decoded value is : ", decoded)
        try {
            const user = await registerModel.findOne({username: decoded.username});
            console.log("User retrieved", user);

            // The username of the friend is in the body of the request.
            const {username} = req.body;

            // Call the service with the username of the friend and the user id.
            const {chat, friend} = await chatService.createChat(username, user._id);

            // Respond with the chat id and the friend's information.
            res.status(200).json({
                id: chat._id,
                user: {
                    username: friend.username,
                    displayName: friend.displayName,
                    profilePic: friend.profilePic
                }
            });
        } catch (err) {
            console.log("User retrieval or chat creation failed: ", err.message);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        return res.status(403).send('Token required');
    }
};


const deleteChat = async (req, res) => {
    try {
        const chatId = req.params.id;

        // Delete the chat and its associated messages
        const deleteResult = await chatModel.deleteOne({ _id: chatId });
        await messageModel.deleteMany({ chat: chatId });

        if (deleteResult.deletedCount > 0) {
            res.status(200).send('Chat deleted successfully');
        } else {
            res.status(404).send('Chat not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while deleting chat');
    }
};


module.exports = {getChats, createChat, deleteChat};
