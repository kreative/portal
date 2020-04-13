const Sequelize = require("sequelize");
const DB = require("../config/db").sequelize;

// there should be a foreign key constraint in this model
// but I forgot to put it in, and it still works
// so I don't see the point of making it more complex then it has to be

const Organization = DB.define('organization', {
    oidn: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    ksn: {
        type: Sequelize.BIGINT,
        references: {
            mode: 'accounts',
            key: 'ksn'
        }
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    admin_email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Organization;