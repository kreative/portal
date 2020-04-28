const Sequelize = require("sequelize");
const DB = require("../config/db").sequelize;

const Warrant = DB.define('warrant', {
    warrant_id: {
        type: Sequelize.TEXT,
        primaryKey: true,
        autoIncrement: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    permit_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'permit',
            key: 'permit_id'
        }
    },
    ksn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'account',
            key: 'ksn',
        }
    },
    issuing_app: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'appchain',
            key: 'aidn'
        }
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Warrant;