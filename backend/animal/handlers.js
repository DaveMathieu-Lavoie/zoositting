const { CONSTANTS } = require("../constants")
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const getCats = async (req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit)
    let verifiedStart = Number.isNaN(start) ? 0 : start
    let verifiedLimit = Number.isNaN(limit) ? 20 : limit

    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        let result = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).find({type: "cat"}).toArray();
        // Pagination
        let end = verifiedStart+verifiedLimit;
        if (end > result.length) {
            end = result.length
        }
        if (verifiedStart > result.length) {
            verifiedStart = result.length
        }
        result = result.slice(verifiedStart, verifiedStart+verifiedLimit);
        res.status(200).json({ status: 200, data: result })

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
};

const getDogs = async (req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit)
    let verifiedStart = Number.isNaN(start) ? 0 : start
    let verifiedLimit = Number.isNaN(limit) ? 20 : limit

    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        let result = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).find({type: "dog"}).toArray();
        // Pagination
        let end = verifiedStart+verifiedLimit;
        if (end > result.length) {
            end = result.length
        }
        if (verifiedStart > result.length) {
            verifiedStart = result.length
        }
        result = result.slice(verifiedStart, verifiedStart+verifiedLimit);
        res.status(200).json({ status: 200, data: result })

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
};

const getAnimals = async (req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    const owner = req.query.owner;
    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit)
    let verifiedStart = Number.isNaN(start) ? 0 : start
    let verifiedLimit = Number.isNaN(limit) ? 20 : limit
    let query = {}
    if (owner != null) {
        query = { owner }
    }
    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        let result = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).find(query).toArray();
        // Pagination
        let end = verifiedStart+verifiedLimit;
        if (end > result.length) {
            end = result.length
        }
        if (verifiedStart > result.length) {
            verifiedStart = result.length
        }
        result = result.slice(verifiedStart, verifiedStart+verifiedLimit);
        res.status(200).json({ status: 200, data: result })

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
};

const getAnimal = async (req, res) => {
    const _id = req.params.animal;
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    try {

        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);

        const result = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).findOne({ _id });

        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
}

const updateAnimal = async(req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    const _id = req.params.animal;
    const query = { _id };
    const newValues = { $set: { ...req.body } };

    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
    
        const user_ans = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).findOne({ _id });
        if (user_ans == null){
            throw new Error(_id + " does not exist")
        }

        await db.collection(CONSTANTS.DB_TABLE.ANIMAL).updateOne(query, newValues)

        res.status(200).json({ status: 200, _id, newValues });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
}

const createAnimal = async (req,res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        let health = {}
        if (!!req.body.health) {
            health = {
                vaccinated: req.body.health.vaccinated,
                food_care: req.body.health.food_care,
            }
        } else {
            health = {
                vaccinated: false,
                food_care: false,
            }
        }
        const size = req.body.size;
        correctSize = ["S", "M", "L"];
        if (size == null || !correctSize.includes(size)) {
            throw new Error("Size is not defined correctly");
        }
        const coatLength = req.body.coatLength;
        correctCoatLength = ["S", "L"];
        if (coatLength == null || !correctCoatLength.includes(coatLength)) {
            throw new Error("Coat length is not defined correctly");
        }

        const animal = { 
            _id: uuidv4(),
            type: req.body.type,
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age,
            image: !!req.body.image ? req.body.image : "" ,
            description: !!req.body.description ? req.body.description : "",
            reservations: [],
            traits: req.body.traits,
            health,
            size, 
            coatLength,
            owner: req.body.owner
        }

        if (animal.type == null || 
            animal.name == null || 
            animal.breed == null || 
            animal.age == null || 
            animal.owner == null ) {
            throw new Error("Invalid entry")
        }


        // Fetch the user to add the pet id in its list of owned animals
        const user_ans = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({ _id: animal.owner });
        if (user_ans == null){
            throw new Error(_id + " does not exist")
        }
        const query = { _id: animal.owner };
        const animal_owned = user_ans.petOwned;
        animal_owned.push(animal._id)
        const newValues = { $set: { petOwned: animal_owned } } ;
        await db.collection(CONSTANTS.DB_TABLE.USER).updateOne(query, newValues)

        await db.collection(CONSTANTS.DB_TABLE.ANIMAL).insertOne(animal);


        res.status(201).json({ status: 201, data: animal });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }

    client.close();
}

const deleteAnimal = async (req,res) => {
    const _id = req.params.animal;

    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    try {

        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        
        // update the user pet owned list
        const animal_ans = await db.collection(CONSTANTS.DB_TABLE.ANIMAL).findOne({ _id });
        if (animal_ans == null){
            throw new Error(_id + " does not exist")
        }
        const user_ans = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({ _id: animal_ans.owner });
        if (user_ans == null){
            throw new Error(animal_ans.owner + " does not exist")
        }
        const query = { _id: user_ans._id };
        let animal_owned = user_ans.petOwned;
        animal_owned = animal_owned.filter(a => a != animal_ans._id)
        const newValues = { $set: { petOwned: animal_owned } } ;
        // Update the user
        await db.collection(CONSTANTS.DB_TABLE.USER).updateOne(query, newValues)
        // Delete the animal
        await db.collection(CONSTANTS.DB_TABLE.ANIMAL).deleteOne({ _id });
        
        res.status(204).json({ status: 204, data: {id: _id, message: "Data was deleted"} });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.params.animal, message: err.message });
    }

    client.close();
}

module.exports = {
    getCats,
    getDogs,
    getAnimals,
    getAnimal,
    updateAnimal,
    createAnimal,
    deleteAnimal
}
