const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");

    // Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data (id, role, etc.) to request
    req.user = verified;
    
    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token", error: error.message });
  }
};

module.exports = { authMiddleware };
