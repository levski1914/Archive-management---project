const router = require("express").Router();
const { register, login, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register-company", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);

module.exports = router;
