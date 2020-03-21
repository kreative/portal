const Sequelize = require("sequelize");
const DB = require("../config/db").sequelize;

const Keychain = DB.define('keychain', {
    ccn: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    ksn: {
        type: Sequelize.BIGINT,
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    fname: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    lname: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true
    },
    bpassword: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    createdat: Sequelize.BIGINT
}, {
    timestamps: false
});

module.exports = Keychain;