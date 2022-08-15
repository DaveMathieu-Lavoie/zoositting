"use strict";

const express = require("express");
const morgan = require("morgan");

express()
    .use(morgan("tiny"))
    .use(express.json())
    .use(express.static("public"))

    // Import defined routes group
    .use(require('./animal/routes'))
    .use(require('./user/routes'))
    
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })

    .listen(8000, () => console.log(`Listening on port 8000`));
