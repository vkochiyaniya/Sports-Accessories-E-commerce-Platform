const express = require("express");
const { requireAuth } = require("@clerk/express");
const { User } = require("../models/userModels"); // ✅ Adjust path if needed

const router = express.Router();

// ✅ GET /api/users/edit/profile
router.get("/profile", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findOne({ where: { clerkId: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("🔴 Fetch profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PUT /api/users/edit/profile
router.put("/profile", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { firstName, lastName, profileImage } = req.body;

    const user = await User.findOne({ where: { clerkId: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ firstName, lastName, profileImage });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("🔴 Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PUT /api/users/edit/profile/image
router.put("/profile/image", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { profileImage } = req.body;

    const user = await User.findOne({ where: { clerkId: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ profileImage });

    res.json({ message: "Profile image updated successfully" });
  } catch (err) {
    console.error("🔴 Update profile image error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
