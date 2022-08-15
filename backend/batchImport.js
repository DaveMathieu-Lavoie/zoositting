"use strict";
const { faker } = require('@faker-js/faker');
const { MongoClient } = require("mongodb");
const fetch  = require("node-fetch")
// use this package to generate unique _ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const bcrypt = require('bcrypt');
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { CONSTANTS }  =  require('./constants');


function randomize(top){
    return Math.floor(Math.random() * top);
}

function randomizeBoolean(){
    const rand = Math.floor(Math.random() * 2);
    return rand < 1 ? true : false;
}

function randomizeAttributes(){

    const possibleSize = Object.values(CONSTANTS.SIZE)
    const possibleTraits = Object.values(CONSTANTS.TRAITS)
    const possibleCoatLength = Object.values(CONSTANTS.COAT_LENGHT)
    
    const randomSize = possibleSize[randomize(possibleSize.length)];
    const randomTraits1 = possibleTraits[randomize(possibleTraits.length)];
    const randomTraits2 = possibleTraits[randomize(possibleTraits.length)];
    const randomTraits3 = possibleTraits[randomize(possibleTraits.length)];
    const randomTraits4 = possibleTraits[randomize(possibleTraits.length)];
    const randomTraits5 = possibleTraits[randomize(possibleTraits.length)];
    const randomTraits = new Map( [[randomTraits1, 0], [randomTraits2, 0], [randomTraits3, 0], [randomTraits4,0], [randomTraits5,0]]);
    const randomCoatLength = possibleCoatLength[randomize(possibleCoatLength.length)];

    const health = {
        vaccinated: randomizeBoolean(),
        food_care: randomizeBoolean()
    }
    const finalTraits = []
    for (const _randomTraits of randomTraits.keys()){
        finalTraits.push(_randomTraits)
    }
    return {
        size: randomSize,
        traits: finalTraits,
        coatLength: randomCoatLength,
        health
    }
}

const getCatImg = async () => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const json = await res.json();
    return json[0].url
}

const getDogImg = async () => {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const json = await res.json();
    return json.message
}

const encrypt = (default_password, saltRounds) => {
    return new Promise( (res, rej) => {
        bcrypt.hash(default_password, saltRounds, function(err, hash) {
            if(err) rej(err);
            res(hash)
        });
    })
}

const users = []
const generateUsers = async () => {
    for (let i = 0; i <= 30; i++ ){

        const firstName = faker.name.firstName();
        const default_password = "testtest";
        const saltRounds = 10;
        const encrypted_password = await encrypt(default_password, saltRounds);
        const user = {
            _id: uuidv4(),
            firstName,
            lastName: faker.name.lastName(),
            address: faker.address.streetAddress(),
            email: faker.internet.email(firstName),
            phonenumber: faker.phone.number('514-###-###'),
            experience: randomize(5),
            password: encrypted_password,
            image:randomize(22),
            petOwned: []
            
        }
        users.push(user)
    }
}
const cats = [];
const generateCats = async () => {
    for (let i = 0; i <= 15; i++ ){

        let randomize1 = randomize(10);
        let randomize2 = randomize(10);
        let age = randomize1 + randomize2;
        if (age == 0) age = 1;
        const owner = users[randomize(users.length)]
        
        const _randomizeAttributes = randomizeAttributes();

        const cat = {
            _id: uuidv4(),
            type: "cat",
            name: faker.name.middleName(),
            breed: faker.animal.cat(),
            age, 
            description: CONSTANTS.LOREM_IPSUM,
            reservations: [],
            image: await getCatImg(),
            owner: owner._id,
            ..._randomizeAttributes
        }
        owner.petOwned.push(cat._id)
        cats.push(cat)
        
    }
}
const dogs = [];
const generateDogs = async () => {
    for (let i = 0; i <= 15; i++ ){

        let randomize1 = randomize(10);
        let randomize2 = randomize(10);
        let age = randomize1 + randomize2;
        if (age == 0) age = 1;
        const owner = users[randomize(users.length)]

        const _randomizeAttributes = randomizeAttributes();


        const dog = {
            _id: uuidv4(),
            type: "dog",
            name: faker.name.middleName(),
            breed: faker.animal.dog(),
            age, 
            description: "",
            reservations: [],
            image: await getDogImg(),
            owner: owner._id,
            ..._randomizeAttributes
        }
        owner.petOwned.push(dog._id)
        dogs.push(dog)
        
    }
}

async function batchImport () {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(CONSTANTS.DB_NAME);
    
    await generateUsers();
    await generateCats()
    await generateDogs()

    await db.collection(CONSTANTS.DB_TABLE.USER).insertMany(users)
    await db.collection(CONSTANTS.DB_TABLE.ANIMAL).insertMany(cats)
    await db.collection(CONSTANTS.DB_TABLE.ANIMAL).insertMany(dogs)

    client.close();
}

batchImport();