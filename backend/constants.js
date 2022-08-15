
require("dotenv").config();

const { MONGO_URI } = process.env;

const CONSTANTS = {
    DB_NAME: "Zoositting",
    DB_TABLE: {
        USER: "USER",
        ANIMAL: "ANIMAL"
    },
    API: "/api",
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    MONGO_URI,
    SIZE: {
        SMALL: "S",
        MEDIUM: "M",
        LARGE: "L"
    },
    SEX: {
        MALE: "M",
        FEMALE: "F"
    },
    TRAITS: {
        CALM: "CALM",
        QUIET: "QUIET",
        SMART: "SMART",
        ENERGETIC: "ENERGETIC",
        LOVESKISSES: "LOVEKISSES",
        FUNNY: "FUNNY",
        AFFECTIONNATE: "AFFECTIONNATE"
    },
    COAT_LENGHT: {
        SHORT: "S",
        LONG: "L"
    },
    LOREM_IPSUM: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus fermentum ipsum id placerat. Nulla gravida iaculis augue, et euismod metus pharetra eget. Vivamus id lectus dui. Morbi velit odio, bibendum eu tortor quis, luctus tincidunt ex. Donec sit amet suscipit libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam vitae volutpat ante, vitae feugiat odio. \nInteger ut lectus id mi dictum vestibulum vel sed nulla. Aenean venenatis nibh nec bibendum auctor. Nam velit magna, mattis ultrices dictum nec, convallis quis est. Sed eget elit at mi pharetra pulvinar. Morbi euismod, neque eget mollis ultrices, lacus felis finibus massa, quis vulputate ligula nibh in lacus. Donec sollicitudin mi et tortor efficitur, ac eleifend lectus malesuada. Vivamus dapibus lectus nec iaculis congue. Integer tempor tristique molestie. Sed ut nisi vel eros placerat consectetur eget ut urna."
}

module.exports = { CONSTANTS }