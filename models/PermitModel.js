const Sequelize = require("sequelize");
const DB = require("../config/db").sequelize;

const Permit = DB.define('permit', {
    permit_id: {
        type: Sequelize.TEXT,
        primaryKey: true,
        autoIncrement: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    designated_app: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'appchain',
            key: 'aidn'
        }
    },
    permit_token: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    scope: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    issuing_ksn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'account',
            key: 'ksn',
        }
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Permit;