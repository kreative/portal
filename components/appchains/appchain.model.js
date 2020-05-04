const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

// there should be a foreign key constraint in this model
// but I forgot to put it in, and it still works
// so I don't see the point of making it more complex then it has to be

const Appchain = DB.define('appchain', {
    acn: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    aidn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    oidn: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Appchain;