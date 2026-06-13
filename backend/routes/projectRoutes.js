const express = require("express");
const router = express.Router();
const { createProject, getAllProjects, getProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllProjects);
router.get("/:id", getProject);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
