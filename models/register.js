const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// This file only define the structure of the data.
const Register = new Schema({
    username: {
      type: String,
      require: true
    },
    password: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
        require: true
    }

});
module.exports = mongoose.model('Register', Register)