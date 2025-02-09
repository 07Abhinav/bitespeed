const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "data", "database.sqlite"),  // ✅ Persistent storage
  logging: false,  // Optional: Disable logging
});

module.exports = sequelize;
