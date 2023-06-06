const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express)

const cors = require('cors');
app.use(cors());


const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');


console.log(process.env.CONNECTION_STRING)
console.log(process.env.PORT)


// Connecting to the mongoose. mongoose will be located in
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use(express.static('public'))

app.use(express.json());



// If someone will request from the server api/Users using 'post' we will respond we creating a new user in the system.
const register = require('./routes/register')
app.use('/api/Users', register);

