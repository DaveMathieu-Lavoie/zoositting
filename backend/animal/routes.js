const router = require('express').Router();
const { CONSTANTS }  =  require('../constants');
const {
    getCats,
    getDogs,
    getAnimal,
    getAnimals,
    updateAnimal,
    createAnimal,
    deleteAnimal
} = require("./handlers")

// List of routes for /animal/
router.get(CONSTANTS.API + "/animal/dog", getDogs)
router.get(CONSTANTS.API + "/animal/cat", getCats)
router.get(CONSTANTS.API + "/animal/:animal", getAnimal)
router.get(CONSTANTS.API + "/animal", getAnimals)
router.put(CONSTANTS.API + "/animal/:animal", updateAnimal)
router.post(CONSTANTS.API + "/animal", createAnimal)
router.delete(CONSTANTS.API + "/animal/:animal", deleteAnimal)


module.exports = router;