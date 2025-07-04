const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const authenticateAdmin = (allowedRoles = ["admin"]) => {
  return ClerkExpressWithAuth((req, res, next) => {
    const { sessionClaims } = req.auth || {};

    if (!sessionClaims) {
      console.warn("🔐 Unauthorized access attempt.");
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Please log in to access this resource.",
      });
    }

    const userRole = sessionClaims.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(`🚫 Access denied for role: ${userRole}`);
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "You don't have permission to access this route.",
      });
    }

    req.user = sessionClaims;
    next();
  });
};

module.exports = authenticateAdmin;
