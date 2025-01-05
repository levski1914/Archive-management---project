const router = require("express").Router();

const {
  createRequest,
  getRequestsByUser,
  updateRequestStatus,
} = require("../controllers/requestController");

const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, createRequest);
router.get("/", authenticate, getRequestsByUser);
router.put("/:id", authenticate, updateRequestStatus);

module.exports = router;
