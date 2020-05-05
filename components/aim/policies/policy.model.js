const Sequelize = require("sequelize");
const DB = require("../../../config/db").sequelize;

const Policy = DB.define('policy', {

}, {
    timestamps: false
});

module.exports = Policy;
