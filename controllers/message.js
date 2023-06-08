const jwt = require("jsonwebtoken");
const messageService = require("../services/message");
const registerModel = require("../models/register");
const key = process.env.JWT_SECRET;

const addMessage = async (req, res) => {
    console.log("addMessage called with req.params.id:", req.params.id);
    console.log("addMessage called with req.body.msg:", req.body.msg);

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, key);
            console.log("Decoded JWT:", decoded);

            // Find the user with the decoded username.
            const user = await registerModel.findOne({username: decoded.username});

            // Use the user's _id as the sender.
            const messageData = {
                sender: user._id,
                content: req.body.msg
            };
            console.log("Message data:", messageData);

            const message = await messageService.addMessage(req.params.id, messageData);
            console.log("Added message:", message);

            if (message) {
                res.status(200).json({
                    'id' : message._id,
                    'created' : message.created,
                    'sender' : {
                        'username' : user.username,
                        'displayName' : user.displayName,
                        'profilePic' : user.profilePic
                    },
                    content: message.content
                });
            } else {
                console.log("Message not added");
                res.status(404).send('Message not added!');
            }
        } catch (err) {
            console.log("Error in addMessage:", err);
            return res.status(401).send("Invalid Token");
        }
    } else {
        console.log("No authorization header");
        return res.status(403).send('Token required');
    }
};



const getMessages = async (req, res) => {
    console.log("getMessages called with req:", req.params.id);
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            jwt.verify(token, key);
            const messages = await messageService.getMessages(req.params.id);
            console.log("Messages retrieved:", messages);
            if (messages) {
                // Format the messages
                const formattedMessages = messages.map(message => ({
                    id: message._id,
                    created: message.created,
                    sender: {
                        username: message.sender.username,
                    },
                    content: message.content
                }));
                res.status(200).json(formattedMessages);
            } else {
                res.status(404).send('Messages not found!');
            }
        } catch (err) {
            console.log("Error in getMessages:", err);
            return res.status(401).send("Invalid Token");
        }
    } else {
        return res.status(403).send('Token required');
    }
};


module.exports = {addMessage, getMessages}