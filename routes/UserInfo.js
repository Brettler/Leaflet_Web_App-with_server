const userInfoController = require('../controllers/UserInfo');

const express = require('express')

var router = express.Router();

router.get('/', userInfoController.processUserInfo);

module.exports = router;
