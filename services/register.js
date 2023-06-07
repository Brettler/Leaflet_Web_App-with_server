// Here we define the logic we can do on the data we define in the model

const Register = require('../models/register');

// Define the methods we can use on the data:

const createUser = async (userData) => {

    const NewUser = new Register(userData);
    try {
        // We wait for the method the finish, this way we are not retriving the promise, we retrive the object it self.
        // Meaning we return the object itself.
        return await NewUser.save();
    } catch (err) {
        console.error(err);
        throw new Error('Error while creating user');
    }
};

module.exports = {createUser}