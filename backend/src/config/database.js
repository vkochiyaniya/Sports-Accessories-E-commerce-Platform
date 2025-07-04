const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_db',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASSWORD || '', // Avoid empty password in production
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

module.exports = sequelize;
