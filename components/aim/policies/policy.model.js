const Sequelize = require("sequelize");
const DB = require("../../../config/db").sequelize;

const Policy = DB.define('policy', {
    policy: {
        type: Sequelize.TEXT,
        primaryKey: true,
    },
    associate_appchain: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'appchain',
            key: 'acn'
        }
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

module.exports = Policy;
