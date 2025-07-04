// models/order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, // Changed to UUID to match User.id
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      shippingAddress: {
        type: DataTypes.TEXT, // Will store JSON stringified address
        allowNull: true,
      },
      items: {
        type: DataTypes.TEXT, // Will store JSON stringified cart items
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "Orders",
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Order;
};