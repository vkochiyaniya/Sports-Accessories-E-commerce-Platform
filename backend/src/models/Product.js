const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, // ✅ Allow NULL initially to avoid migration errors
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      material: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      reviews: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
      tableName: "Products",
    }
  );

  return Product;
};
