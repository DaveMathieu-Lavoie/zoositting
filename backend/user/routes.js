const router = require('express').Router();
const { CONSTANTS }  =  require('../constants');
const {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser,
    login
} = require("./handlers")

// List of routes for /user/
router.get(CONSTANTS.API + "/user", getUsers);
router.get(CONSTANTS.API + "/user/:user", getUser);
router.put(CONSTANTS.API + "/user/:user", updateUser);
router.post(CONSTANTS.API + "/user", createUser);
router.post(CONSTANTS.API + "/user/login", login);
router.delete(CONSTANTS.API + "/user/:user", deleteUser)

module.exports = router;