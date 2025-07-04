// src/utils/mergeUsers.js
const { clerkClient } = require("@clerk/clerk-sdk-node");
const { User } = require("../models");

const mergeClerkUsersToDB = async () => {
  try {
    const dbUsers = await User.findAll();
    const clerkUsersResponse = await clerkClient.users.getUserList();
    const clerkUsers = clerkUsersResponse?.data || [];

    const dbClerkIds = dbUsers.map((u) => u.clerkId);

    for (const clerkUser of clerkUsers) {
      const { id: clerkId, emailAddresses, firstName, lastName, imageUrl } = clerkUser;
      const email = emailAddresses?.[0]?.emailAddress || null;
      const name = `${firstName || ""} ${lastName || ""}`.trim();
      const profileImage = imageUrl;

      if (!dbClerkIds.includes(clerkId)) {
        await User.create({
          name: name || "No Name",
          email,
          role: "user",
          clerkId,
          profileImage: profileImage || undefined,
        });
      }
    }

    console.log("✅ Clerk users merged with DB successfully.");
  } catch (error) {
    console.error("❌ Error auto-merging Clerk and DB users:", error);
  }
};

module.exports = mergeClerkUsersToDB;
