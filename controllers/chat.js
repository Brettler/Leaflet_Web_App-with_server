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
        } catch (err) {
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

            // Check if the error message is 'User cannot add themselves as a friend'
            if (err.message === 'User cannot add themselves as a friend.' || err.message === 'No user with this name exists in the system.') {
                // Send back a specific error message to the client
                return res.status(400).send(err.message);
            } else {
                // For all other errors, send back a generic error message
                return res.status(500).send("Failed adding a friend");
            }
        }
    }
};


const deleteChat = async (req, res) => {
    console.log("Attempting to delete chat..."); // added logging

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, key);
            console.log("Token verified");
        } catch(err) {
            console.log("Token verification failed: ", err.message);
            return res.status(401).send("Invalid Token");
        }

        try {
            const chatId = req.params.id;
            const chat = await chatModel.findById(chatId);
            if (!chat) {
                console.log("Chat not found, sending status 404");
                return res.status(404).send('Chat not found');
            }

            const user = await registerModel.findOne({username: decoded.username});
            if (!chat.participants.includes(user._id)) {
                console.log("User is not a participant in the chat, sending status 403");
                return res.status(403).send('You are not authorized to delete this chat');
            }

            // Delete the chat and its associated messages
            const deleteResult = await chatModel.deleteOne({ _id: chatId });
            await messageModel.deleteMany({ chat: chatId });

            if (deleteResult.deletedCount > 0) {
                console.log("Chat deleted successfully, sending status 200");
                // We just return status 200 for success.
                res.sendStatus(200);
            } else {
                console.log("Chat not found, sending status 404");
                res.status(404).send('Chat not found');
            }
        } catch (err) {
            console.error("Error occurred while deleting chat: ", err);
            res.status(500).send('Error while deleting chat');
        }
    } else {
        console.log("No Authorization header found, sending status 403");
        return res.status(403).send('Token required');
    }
};


module.exports = {getChats, createChat, deleteChat};
