const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

// there should be a foreign key constraint in this model
// but I forgot to put it in, and it still works
// so I don't see the point of making it more complex then it has to be

const ResetCode = DB.define('reset_code', {
    code: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    ksn: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'ksn'
        }
    },
    createdat: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = ResetCode;