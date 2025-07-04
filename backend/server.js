const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const sequelize = require("./src/config/database");
const app = express();

const { mergeUsersCore } = require("./src/controllers/mergeUsersController"); // ✅ correct import

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Routes
const { requireAuth } = require("@clerk/express");
app.use("/api/users-merged", requireAuth(), require("./src/routes/mergeUsersRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/payment", require("./src/routes/paymentRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/contact", require("./src/routes/contact"));
app.use("/api/users/edit", require("./src/routes/editprofileroutes"));

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// ✅ Call merge function on server start
mergeUsersCore()
  .then((merged) => {
    console.log(`✅ Synced ${merged.length} Clerk users to DB on server start`);
  })
  .catch((err) => {
    console.error("❌ Failed to sync Clerk users on start:", err.message);
  });

// Start server
const PORT = process.env.PORT || 5000;
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`✅ Database synced`);
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err.message);
  });
