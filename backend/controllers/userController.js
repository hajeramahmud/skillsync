const User = require("../models/User");

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  const { name, bio, skills } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, skills },
    { new: true }
  ).select("-password");

  res.json(user);
};

const getPublicProfile = async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

module.exports = { getProfile, updateProfile, getPublicProfile };
