const router = require("express").Router();
const {
  addUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");

router.post("/add", authenticate, authorize(["admin"]), addUser);
router.get("/", authenticate, authorize(["admin"]), getUsers);
router.delete("/:userId", authenticate, authorize(["admin"]), deleteUser);
module.exports = router;
