require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const PORT = process.env.SERVERPORT || 3000;
const DB = require("./config/db").sequelize;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

DB.authenticate()
  .then(() => console.log('Portal DB is operational.'))
  .catch(err => console.error('Connection to Portal DB failed', err));

server.get('/', (req, res) => res.send("Welcome to Portal"));

server.listen(PORT, '127.0.0.1', console.log("Portal Server is ready when you are!"));
