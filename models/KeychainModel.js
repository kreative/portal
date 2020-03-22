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
    aidn: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    key: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Keychain;