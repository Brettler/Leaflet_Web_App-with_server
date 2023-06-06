const registerService = require('../services/register');

// This method will handle the request from the client and will be responsible to answer to him.
const createUser = async (req, res) => {
    // We are wiating for the createUser from the service to be done and just then we will execute.
    res.json(await registerService.createUser(req.body.username))
}

module.exports = {createUser}