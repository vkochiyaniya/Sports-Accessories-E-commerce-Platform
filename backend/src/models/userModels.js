module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", // ✅ Keep model name as "User"
    {
      id: {
        type: DataTypes.UUID, // Clerk's user ID (external auth)
        defaultValue: DataTypes.UUIDV4, // Generate a UUID when creating a new user
        primaryKey: true, // ✅ Ensure it's PRIMARY KEY
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      clerkId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
      },
    },
    {
      timestamps: true,
      tableName: "Users", // ✅ Explicitly set table name
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
  };

  return User;
};
