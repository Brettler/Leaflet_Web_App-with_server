const Message = require("../models/message");
const Chat = require("../models/chat");
// We set the io varaible in app.js
let io;
const setIo = function(ioInstance) {
    io = ioInstance;
};
const addMessage = async (chatId, messageData) => {
    try {
        const message = new Message(messageData);
        const savedMessage = await message.save();

        const chat = await Chat.findById(chatId);
        chat.messages.push(savedMessage);
        await chat.save();

        // Retrieve the saved message again to populate sender details
        const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'username displayName profilePic');

        // emit newMessage event to all connected sockets
        if (io) {
            io.emit('newMessage', { chatId, message: populatedMessage});
        }
        return populatedMessage;
    } catch (err) {
        console.error(err);
        throw new Error('Error while adding message');
    }
};


const getMessages = async (chatId) => {
    try {
        const chat = await Chat.findById(chatId).populate({
            path: 'messages',
            options: { sort: { 'created': -1 } },
            populate: { path: 'sender', select: 'username' }
        });
        return chat.messages;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


module.exports = {addMessage, getMessages, setIo}