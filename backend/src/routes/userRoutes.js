const express = require("express");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const { Pool } = require("pg");
const { uploadImage } = require("../controllers/uploadController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const { User } = require("../models");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sportx",
  password: "123456789",
  port: 5432,
});

router.get("/:userId/profile", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ where: { clerkId: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const [firstName = "", lastName = ""] = (user.name || "").split(" ");

    res.json({
      firstName,
      lastName,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ✅ Update user profile (DB + Clerk + Cloudinary image)
router.put("/:userId/profile", async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, profileImage } = req.body;

  try {
    const user = await User.findOne({ where: { clerkId: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const fullName = `${firstName} ${lastName}`.trim();
    await user.update({ name: fullName, profileImage });

    // Update Clerk name
    await clerkClient.users.updateUser(userId, {
      firstName,
      lastName,
      
    });

    // ✅ Upload Cloudinary image to Clerk profile if provided
    if (profileImage && profileImage.startsWith("http")) {
      try {
        const response = await axios.get(profileImage, {
          responseType: "arraybuffer",
        });

        const imageBuffer = Buffer.from(response.data, "binary");

        await clerkClient.users.updateUserProfileImage(userId, imageBuffer);
      } catch (imageError) {
        console.warn("⚠️ Failed to upload image to Clerk:", imageError.message);
        // We don't block the update, just warn
      }
    }

    res.status(200).json({ message: "✅ Profile updated in DB and Clerk" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "❌ Failed to update profile" });
  }
});
// Upload image route
router.post("/upload-image", uploadMiddleware.single("image"), uploadImage);

// Test route
router.get("/", (req, res) => res.send("✅ Users API Working!"));

// Get merged users
router.get("/users-merged", async (req, res) => {
  try {
    const dbUsers = await User.findAll();
    const clerkUsersResponse = await clerkClient.users.getUserList();
    const clerkUsers = clerkUsersResponse?.data || [];

    const dbClerkIds = dbUsers.map((u) => u.clerkId);
    const newSyncedUsers = [];

    for (const clerkUser of clerkUsers) {
      const { id: clerkId, emailAddresses, firstName, lastName, imageUrl } = clerkUser;
      const email = emailAddresses?.[0]?.emailAddress || null;
      const name = `${firstName || ""} ${lastName || ""}`.trim();
      const profileImage = imageUrl;

      if (!dbClerkIds.includes(clerkId)) {
        // Add missing Clerk user to DB
        const newUser = await User.create({
          name: name || "No Name",
          email,
          role: "user",
          clerkId,
          profileImage: profileImage || undefined,
        });
        newSyncedUsers.push(newUser);
      }
    }

    // Re-fetch complete DB users after sync
    const updatedDbUsers = await User.findAll();

    // Merge DB with Clerk info for display
    const mergedUsers = updatedDbUsers.map((dbUser) => {
      const clerkUser = clerkUsers.find((cu) => cu.id === dbUser.clerkId);
      return {
        id: dbUser.id,
        name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || dbUser.name,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress || dbUser.email,
        role: dbUser.role,
        clerkId: dbUser.clerkId,
        profileImage: clerkUser?.imageUrl || dbUser.profileImage,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };
    });

    res.json(mergedUsers);
  } catch (error) {
    console.error("Error merging Clerk and DB users:", error);
    res.status(500).json({ message: "Failed to merge users." });
  }
});


// Toggle role between admin and user
router.put("/toggle-role/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Fetch DB user
    const { rows } = await pool.query('SELECT * FROM "Users" WHERE "id" = $1', [userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found in DB" });

    const dbUser = rows[0];

    // 2. Determine new role
    const newRole = dbUser.role === "admin" ? "user" : "admin";

    // 3. Update DB role
    await pool.query('UPDATE "Users" SET "role" = $1 WHERE "id" = $2', [newRole, userId]);

    // 4. Find matching Clerk user by email
    const clerkUsersResponse = await clerkClient.users.getUserList({ emailAddress: [dbUser.email] });
    const clerkUser = clerkUsersResponse.data?.[0];

    // 5. Update Clerk role if user found
    if (clerkUser) {
      await clerkClient.users.updateUser(clerkUser.id, {
        publicMetadata: { role: newRole },
      });
    }

    res.status(200).json({ message: "✅ Role toggled successfully", newRole });
  } catch (error) {
    console.error("Toggle role error:", error);
    res.status(500).json({ error: "Failed to toggle role" });
  }
});

// Delete user by Clerk ID
router.delete("/:clerkId", async (req, res) => {
  const { clerkId } = req.params;

  try {
    // 1. Delete from Clerk
    await clerkClient.users.deleteUser(clerkId);

    // 2. Delete from DB
    await User.destroy({ where: { clerkId } });

    res.status(200).json({ message: "User deleted from Clerk and DB" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
