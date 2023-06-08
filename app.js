const express = require('express');
var app = express();

// bodyParser will deal with the request in 'post' method.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
// Deal with the information in json object. set it as a middleware.
app.use(express.json());

// cors used as middleware.
const cors = require('cors');
app.use(cors());






const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');


console.log(process.env.CONNECTION_STRING)
console.log(process.env.PORT)



const mongoose= require('mongoose');
// Connecting to the mongoose. mongoose will be located in 'CONNECTION_STRING'. This string is define in the config directory.
// need to swich instead of the hard codes server to - 'process.env.CONNECTION_STRING'
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// Settings to the server:
// 'public' will contain static files that the server will use.
app.use(express.static('public'))

// If someone will request from the server api/Users using 'post' we will respond we creating a new user in the system.
const register = require('./routes/register')

// API that use to register user in the system.
app.use('/api/Users', register);


const login = require('./routes/login')

// API to log in user into the system.
app.use('/api/Tokens', login);


const userInfo = require('./routes/UserInfo')

// API to get user information.
app.use('/api/Users/:id', userInfo);

// 'process.env.PORT' varaible will contain the port that the server will run on it. This string is define in the config directory.
// need to swich instead of the hard coded port to - 'process.env.PORT
app.listen(process.env.PORT)