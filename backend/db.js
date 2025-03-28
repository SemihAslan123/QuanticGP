const { Pool } = require("pg");
require("dotenv").config();

console.log("DB Username:", process.env.DB_USERNAME);
console.log("DB Password:", process.env.DB_PASSWORD);


const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};


const pool = new Pool(credentials);

module.exports = pool;