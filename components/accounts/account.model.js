const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

const Account = DB.define('account', {
    ksn: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
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
    phone_country_code: {
        type: Sequelize.BIGINT
    },
    phone_number: {
        type: Sequelize.BIGINT,
        unique: true
    },
    bpassword: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email_verified: {
        type: Sequelize.BOOLEAN,
    },
    profile_picture: {
        type: Sequelize.TEXT,
    },
    createdat: Sequelize.BIGINT
}, {
    timestamps: false
});

module.exports = Account;