const jwt = require("jsonwebtoken");

const patientMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role && decoded.role !== "patient") {
      return res.status(403).json({ message: "Access denied. Patient role required." });
    }

    req.user = decoded; // { id, name, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = patientMiddleware;
