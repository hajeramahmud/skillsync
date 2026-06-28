const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getTasks, createTask, updateTaskStatus, deleteTask } = require("../controllers/taskController");

// Mounted at /api/projects — handles project-scoped task routes
const projectRouter = express.Router();
projectRouter.get("/:projectId/tasks", protect, getTasks);
projectRouter.post("/:projectId/tasks", protect, createTask);

// Mounted at /api/tasks — handles individual task operations
const taskRouter = express.Router();
taskRouter.put("/:taskId/status", protect, updateTaskStatus);
taskRouter.delete("/:taskId", protect, deleteTask);

module.exports = { projectRouter, taskRouter };
