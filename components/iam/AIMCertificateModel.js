const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

const AIMCertificate = DB.define('aim_certificate', {
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

module.exports = AIMCertificate;