const { CONSTANTS } = require("../constants")
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

const decrypt = (plainPassword, hash) => {
    return new Promise((res,rej) => {
        bcrypt.compare(plainPassword, hash, function(err, result) {
            if(err) rej(err);
            res(result);
        })
})};

const encrypt = (default_password, saltRounds) => {
    return new Promise( (res, rej) => {
        bcrypt.hash(default_password, saltRounds, function(err, hash) {
            if(err) rej(err);
            res(hash)
        });
    })
}

const getUsers = async (req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit)
    let verifiedStart = Number.isNaN(start) ? 0 : start
    let verifiedLimit = Number.isNaN(limit) ? 20 : limit

    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        let result = await db.collection(CONSTANTS.DB_TABLE.USER).find().toArray();
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

const getUser = async (req, res) => {
    const _id = req.params.user;
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    try {

        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);

        const result = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({ _id });

        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
};

const updateUser = async(req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    const _id = req.params.user;
    const query = { _id };
    const newValues = { $set: { ...req.body } };

    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);

        const user_ans = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({ _id });
        if (user_ans == null){
            throw new Error(_id + " does not exist")
        }

        await db.collection(CONSTANTS.DB_TABLE.USER).updateOne(query, newValues)

        res.status(200).json({ status: 200, _id, newValues });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
}

const createUser = async (req, res) => {
    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    try {
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        if (req.body.password == null) {
            throw new Error("Missing the attribute password")
        }
        const encrypted_password = await encrypt(req.body.password, 10);
        const user = { 
            _id: uuidv4(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            email: req.body.email,
            experience: req.body.experience,
            phonenumber: req.body.phonenumber,
            password: encrypted_password,
            image: req.body.image,
            petOwned: []
        }


        if (user.phonenumber == null  || user.firstName == null || user.lastName == null  || user.address == null  || user.email == null  || user.experience == null ) {
            throw new Error("Invalid entry")
        }
        
        // Verify is email is already taken
        const users_emails = await db.collection(CONSTANTS.DB_TABLE.USER).find().project({email: 1, _id:0 }).toArray()
        const user_emails_array = users_emails.map(e => e.email)

        if (user_emails_array.includes(user.email)) {
            throw new Error("Email is already taken")
        }
        
        await db.collection(CONSTANTS.DB_TABLE.USER).insertOne(user);
        res.status(201).json({ status: 201, data: user });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }

    client.close();
}

const deleteUser = async (req, res) => {
    const _id = req.params.user;

    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);
    try {

        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        
        
        // Delete its owned pet
        const user = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({ _id });
        if (user == null){
            throw new Error("User does not exist")
        }
        const promise_list = []
        user.petOwned.forEach( e => {
            promise_list.push(db.collection(CONSTANTS.DB_TABLE.ANIMAL).findOne({_id: e._id}))
        })
        console.log(promise_list)
        await Promise.all(promise_list)
        await db.collection(CONSTANTS.DB_TABLE.USER).deleteOne({ _id });
        
        res.status(204).json({ status: 204, data: {id: _id, message: "Data was deleted"} });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.params.user, message: err.message });
    }

    client.close();
}

const login = async (req, res) => {
    const email = req.body.email;
    const plainPassword = req.body.password;

    const client = new MongoClient(CONSTANTS.MONGO_URI, CONSTANTS.MONGO_OPTIONS);

    try {

        if (email == null){
            throw new Error("Missing attributes: email")
        } else if (plainPassword == null) {
            throw new Error("Missing attributes password")
        }
        
        await client.connect();
        const db = client.db(CONSTANTS.DB_NAME);
        const result = await db.collection(CONSTANTS.DB_TABLE.USER).findOne({email});
        if (result == null){
            throw new Error("User does not exist")
        }
        const hash = result.password;
        const isPasswordCorrect = await decrypt(plainPassword, hash)
        // Delete the password from the object that we sent to the frontend
        delete result.password
        if (!isPasswordCorrect) {
            throw new Error("Wrong password");
        } else {
            res.status(200).json({ status: 200, data: result, message: "success" })
        }


    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
}

module.exports = {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser,
    login
}
