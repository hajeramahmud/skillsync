
const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectRecommendations
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllProjects);

// Skill-based recommendations (JWT protected)
router.get(
  "/:id/recommendations",
  protect,
  getProjectRecommendations
);

router.get("/:id", getProject);

router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;