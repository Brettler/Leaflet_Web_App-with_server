const message = require('./message')

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Chat = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [Message]
});

module.exports = mongoose.model('Chat', Chat)