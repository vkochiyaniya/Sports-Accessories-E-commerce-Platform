const express = require("express");
const { mergeUsers } = require("../controllers/mergeUsersController");

const router = express.Router();

// ✅ Now you don't need requireAuth() here anymore
router.get("/", mergeUsers);

module.exports = router;
