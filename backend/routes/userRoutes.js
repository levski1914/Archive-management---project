const router = require("express").Router();
const { addUser, getUsers } = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");

router.post("/add", authenticate, authorize(["admin"]), addUser);
router.get("/", authenticate, authorize(["admin"]), getUsers);

module.exports = router;
