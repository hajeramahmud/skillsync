const Project = require("../models/Project");
const User = require("../models/User");

const getStats = async (req, res) => {
  const [topSkills, topProjects, topMembers, totalUsers, totalProjects] = await Promise.all([
    Project.aggregate([
      { $unwind: "$skillsNeeded" },
      { $group: { _id: "$skillsNeeded", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Project.aggregate([
      { $addFields: { memberCount: { $size: "$members" } } },
      { $sort: { memberCount: -1, createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $project: {
          title: 1,
          memberCount: 1,
          skillsNeeded: 1,
          ownerName: { $arrayElemAt: ["$ownerData.name", 0] },
        },
      },
    ]),

    Project.aggregate([
      { $unwind: "$members" },
      { $group: { _id: "$members", projectCount: { $sum: 1 } } },
      { $sort: { projectCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $project: {
          projectCount: 1,
          name: { $arrayElemAt: ["$userData.name", 0] },
          skills: { $arrayElemAt: ["$userData.skills", 0] },
        },
      },
    ]),

    User.countDocuments(),
    Project.countDocuments(),
  ]);

  res.json({
    topSkills: topSkills.map((s) => ({ skill: s._id, count: s.count })),
    topProjects,
    topMembers,
    totals: { users: totalUsers, projects: totalProjects },
  });
};

module.exports = { getStats };
