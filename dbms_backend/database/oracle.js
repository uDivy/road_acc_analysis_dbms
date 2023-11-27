const { Sequelize } = require('sequelize');
require('dotenv').config();
console.log(process.env.DB_USER)

const sequelize = new Sequelize(
  `oracle://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SID}`);

  module.exports = sequelize;

