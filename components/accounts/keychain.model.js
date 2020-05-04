const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

// there should be a foreign key constraint in this model
// but I forgot to put it in, and it still works
// so I don't see the point of making it more complex then it has to be

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