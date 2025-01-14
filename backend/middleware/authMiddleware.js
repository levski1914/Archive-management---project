const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware за удостоверяване (Authentication)
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Намиране на потребителя в базата данни
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Добавяне на потребителя в `req` за следващите middlewares или контролери
    req.user = user;
    next();
  } catch (error) {
    console.error("Token validation error:", error);

    // Проверка за изтекъл токен
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    // За други грешки с токена
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware за разрешения (Authorization)
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { authenticate, authorize };
