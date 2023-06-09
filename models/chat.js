const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Register'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
});

module.exports = mongoose.model('Chat', ChatSchema);
