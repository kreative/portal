const Sequelize = require("sequelize");
const DB = require("../../../config/db").sequelize;

const Certificate = DB.define('certificate', {
    certificateID: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    access_token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    identity_token: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    policies: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Certificate;