const router = require("express").Router();

const {
  createRequest,
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, createRequest);
router.get("/", authenticate, getAllRequests);
router.put("/:id", authenticate, updateRequestStatus);

module.exports = router;
