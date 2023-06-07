const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

const UserInfoService = require('../services/UserInfo');

const processUserInfo = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, key);
            const username = decoded.username;
            const user = await UserInfoService.getUserInfo(username);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('User not found!');
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    } else {
        return res.status(403).send('Token required');
    }
}

module.exports = { processUserInfo }
