// This file is going to connect between the routes from the client and the action of the controller.

const registerController = require('../controllers/register');

const express = require('express')

var router = express.Router();

// If someone will request from the server api/Users using 'post' we will respond we creating a new user in the system.
router.route('/').post(registerController.createUser);

module.exports = router;