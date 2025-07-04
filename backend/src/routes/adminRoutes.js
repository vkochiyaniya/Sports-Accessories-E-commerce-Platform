const express = require("express");
const router = express.Router();
const { Admin } = require("../models");
require("dotenv").config();

const SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Middleware to extract Clerk User ID from headers
const authenticateUser = (req, res, next) => {
  const clerkUserId = req.headers["x-clerk-user-id"];
  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized: Missing Clerk User ID" });
  }
  req.clerkUserId = clerkUserId; // Attach to request object
  next();
};

// ✅ Ensure admin exists in the database and sync role with Clerk
router.post("/ensure-admin", authenticateUser, async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const userId = req.clerkUserId;

    let admin = await Admin.findOne({ where: { clerkUserId: userId } });

    if (!admin) {
      admin = await Admin.create({
        clerkUserId: userId,
        email,
        firstName,
        lastName,
        role: "admin",
      });

      // ✅ Sync role to Clerk metadata
      await updateClerkRole(userId, "admin");
    } else {
      await Admin.update({ email, firstName, lastName }, { where: { clerkUserId: userId } });
    }

    res.status(200).json({ message: "✅ Admin verified!", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Manually Update Clerk User Role via API
router.post("/update-role", authenticateUser, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: "User ID and role are required" });
    }

    // ✅ Update role in database
    await Admin.update({ role }, { where: { clerkUserId: userId } });

    // ✅ Sync role to Clerk metadata
    await updateClerkRole(userId, role);

    res.status(200).json({ message: `✅ Role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch Admin Dashboard
router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { clerkUserId: req.clerkUserId } });

    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    res.status(200).json({ message: "✅ Welcome to the admin dashboard!", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Function to Update Clerk Role in Public Metadata
async function updateClerkRole(userId, role) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_metadata: { role } }),
    });

    if (!response.ok) {
      console.error("❌ Failed to update Clerk role:", await response.json());
    } else {
      console.log(`✅ Clerk role updated to ${role} for user: ${userId}`);
    }
  } catch (error) {
    console.error("❌ Error updating Clerk role:", error);
  }
}

module.exports = router;
