const express = require("express");
const router = express.Router();
const { applyToProject, getApplications, updateStatus } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:id/apply", protect, applyToProject);
router.get("/:id/applications", protect, getApplications);
router.put("/status/:id", protect, updateStatus);

module.exports = router;
