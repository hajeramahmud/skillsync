const Application = require("../models/Application");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

const applyToProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const already = await Application.findOne({ project: req.params.id, applicant: req.user._id });
  if (already) return res.status(400).json({ message: "Already applied" });

  const application = await Application.create({ project: req.params.id, applicant: req.user._id });
  res.status(201).json(application);
};

const getApplications = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

  const applications = await Application.find({ project: req.params.id }).populate("applicant", "name email skills");
  res.json(applications);
};

const updateStatus = async (req, res) => {
  const application = await Application.findById(req.params.id).populate("project");
  if (!application) return res.status(404).json({ message: "Application not found" });
  if (application.project.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

  application.status = req.body.status;
  await application.save();

  if (req.body.status === "accepted") {
    await Project.findByIdAndUpdate(application.project._id, {
      $addToSet: { members: application.applicant },
    });
  }

  await Notification.create({
    user: application.applicant,
    message: `Your application to "${application.project.title}" was ${req.body.status}.`,
  });

  res.json(application);
};

module.exports = { applyToProject, getApplications, updateStatus };
