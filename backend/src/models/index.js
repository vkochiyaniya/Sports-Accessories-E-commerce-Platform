const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");
const { Sequelize, DataTypes } = require("sequelize");

const db = {};

// ✅ Read all model files dynamically
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath)(sequelize, DataTypes);
    db[model.name] = model;
  });

// ✅ Setup model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Attach Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
