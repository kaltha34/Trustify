const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data (id, role, etc.) to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token", error: error.message });
  }
};



module.exports = { authMiddleware };
