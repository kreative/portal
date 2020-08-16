const Sequelize = require("sequelize");
const DB = require("../../config/db").sequelize;

const Session = DB.define('session', {
  session_id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: false
  },
  ksn: {
    type: Sequelize.BIGINT,
    references: {
      model: 'account',
      key: 'ksn'
    }
  },
  tag: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
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

module.exports = Session;