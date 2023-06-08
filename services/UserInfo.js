const registerModel = require('../models/register');

const getUserInfo = async (username) => {
    try {
        const user = await registerModel.findOne({ username: username });
        if (!user) {
            throw new Error('User not found');
        }
        return {username: user.username, displayName: user.displayName, profilePic: user.profilePic}
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {getUserInfo}
