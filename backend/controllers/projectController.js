const Project = require("../models/Project");

const createProject = async (req, res) => {
  const { title, description, skillsNeeded } = req.body;
  const project = await Project.create({ title, description, skillsNeeded, owner: req.user._id });
  res.status(201).json(project);
};

const getAllProjects = async (req, res) => {
  const projects = await Project.find().populate("owner", "name email");
  res.json(projects);
};

const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email");
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

  await project.deleteOne();
  res.json({ message: "Project deleted" });
};

module.exports = { createProject, getAllProjects, getProject, updateProject, deleteProject };
