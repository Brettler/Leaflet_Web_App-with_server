// Here we define the logic we can do on the data we define in the model

const Register = require('../models/register');

// Define the methods we can use on the data:

const createUser = async (username, password, displayName, profilePic) => {
    const NewUser = new Register({
        username:username,
        password:password,
        displayName:displayName,
        profilePic:profilePic
    });
    // We wait for the method the finish, this way we are not retriving the promise, we retrive the object it self.
    // Meaning we return the object itself.
    return await NewUser.save();
};

module.exports = {createUser}