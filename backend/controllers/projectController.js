
const mongoose = require("mongoose");

const Project = require("../models/Project");
const User = require("../models/User");

const {
  normalizeSkills,
  calculateJaccard,
  getMatchedSkills
} = require("../utils/skillMatcher");

const createProject = async (req, res) => {
  const { title, description, skillsNeeded } = req.body;

  const project = await Project.create({
    title,
    description,
    skillsNeeded,
    owner: req.user._id
  });

  res.status(201).json(project);
};

const getAllProjects = async (req, res) => {
  const projects = await Project.find()
    .populate("owner", "name email");

  res.json(projects);
};

const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    return res.status(404).json({
      message: "Project not found"
    });
  }

  res.json(project);
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found"
    });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not allowed"
    });
  }

  const updated = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found"
    });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not allowed"
    });
  }

  await project.deleteOne();

  res.json({
    message: "Project deleted"
  });
};

// Skill-based teammate recommendations
const getProjectRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const requiredSkills = normalizeSkills(
      project.skillsNeeded
    );

    if (requiredSkills.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No skills required for this project",
        recommendations: []
      });
    }

    // Exclude project owner and existing members
    const excludedIds = [
      project.owner,
      ...project.members
    ];

    // MongoDB aggregation to find matching candidates
    const candidates = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds }
        }
      },
      {
        $addFields: {
          normalizedSkills: {
            $map: {
              input: { $ifNull: ["$skills", []] },
              as: "skill",
              in: {
                $toLower: {
                  $trim: { input: "$$skill" }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          $expr: {
            $gt: [
              {
                $size: {
                  $setIntersection: [
                    "$normalizedSkills",
                    requiredSkills
                  ]
                }
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          bio: 1,
          skills: 1
        }
      }
    ]);

    // Calculate similarity scores
    const recommendations = candidates.map(candidate => {
      const matchedSkills = getMatchedSkills(
        requiredSkills,
        candidate.skills
      );

      const score = calculateJaccard(
        requiredSkills,
        candidate.skills
      );

      return {
        userId: candidate._id,
        name: candidate.name,
        email: candidate.email,
        bio: candidate.bio,
        skills: candidate.skills,
        matchedSkills,
        score: Math.round(score * 100)
      };
    });

    // Highest matching score first
    recommendations.sort((a, b) =>
      b.score - a.score ||
      a.name.localeCompare(b.name)
    );

    return res.status(200).json({
      success: true,
      projectId: project._id,
      requiredSkills,
      totalCandidates: recommendations.length,
      recommendations
    });

  } catch (error) {
    console.error("Recommendation Error:", error);

    return res.status(500).json({
      message: "Failed to generate recommendations"
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectRecommendations
};
