const jwt = require("jsonwebtoken");

const doctorMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    //console.log("Authorization Header:", req.headers.authorization);


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Optional: You can enforce role check only if your token contains "role"
    if (decoded.role && decoded.role !== "doctor") {
      return res.status(403).json({ message: "Access denied. Doctor role required." });
    }

    req.user = decoded; // contains { id, email, name, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = doctorMiddleware;
