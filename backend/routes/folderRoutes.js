const router = require("express").Router();
const {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  searchFolders,
} = require("../controllers/folderController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, createFolder);
router.get("/", authenticate, getAllFolders);
router.get("/:id", authenticate, getFolderById);
router.put("/:id", authenticate, updateFolder);
router.delete("/:id", authenticate, deleteFolder);
router.get("/search", authenticate, searchFolders);

module.exports = router;
