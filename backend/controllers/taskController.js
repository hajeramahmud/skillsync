const Task = require("../models/Task");
const Project = require("../models/Project");

const isMemberOrOwner = (project, userId) => {
  const id = userId.toString();
  return (
    project.owner.toString() === id ||
    project.members.some((m) => m.toString() === id)
  );
};

const getTasks = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!isMemberOrOwner(project, req.user._id))
    return res.status(403).json({ message: "Not authorized" });

  const tasks = await Task.find({ project: req.params.projectId })
    .populate("createdBy", "name")
    .sort({ createdAt: 1 });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!isMemberOrOwner(project, req.user._id))
    return res.status(403).json({ message: "Not authorized" });

  const task = await Task.create({
    title: title.trim(),
    project: req.params.projectId,
    createdBy: req.user._id,
  });
  await task.populate("createdBy", "name");
  res.status(201).json(task);
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["todo", "inprogress", "done"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  if (!isMemberOrOwner(project, req.user._id))
    return res.status(403).json({ message: "Not authorized" });

  task.status = status;
  await task.save();
  res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isOwner && !isCreator)
    return res.status(403).json({ message: "Not authorized" });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask };
