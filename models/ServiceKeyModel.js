const Sequelize = require("sequelize");
const DB = require("../config/db").sequelize;

const ServiceKey = DB.define('service_key', {
    skidn: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    service_key: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    calling_aidn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'appchain',
            key: 'aidn',
        }
    },
    recieving_aidn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'appchain',
            key: 'aidn',
        }
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

module.exports = ServiceKey;