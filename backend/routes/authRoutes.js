const router = require("express").Router();
const {
  register,
  login,
  updateMe,
  getMe,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register-company", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/me/:id", authenticate, updateMe);

module.exports = router;
