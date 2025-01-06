const router = require("express").Router();

const {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  reminderHandler,
  returnHandler,
} = require("../controllers/requestController");

const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, createRequest);
router.post("/:id/reminder", authenticate, reminderHandler);
router.put("/:id/return", authenticate, returnHandler);
router.get("/", authenticate, getAllRequests);
router.put("/:id", authenticate, updateRequestStatus);

module.exports = router;
