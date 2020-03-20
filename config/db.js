require('dotenv').config();

const password  = process.env.PGPASSWORD;
const username  = process.env.PGUSERNAME;
const port      = process.env.PGPORT;
const database  = process.env.PGDATABASE;
const host      = process.env.PGHOST;

const Sequelize = require("sequelize");

exports.sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "postgres",
    dialectOptions: {
        ssl: true
    },
    port: port,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});