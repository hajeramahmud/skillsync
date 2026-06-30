const Endorsement = require("../models/Endorsement");
const User = require("../models/User");

const endorseSkill = async (req, res) => {
  const { skill } = req.body;
  const { userId } = req.params;

  if (userId === req.user._id.toString())
    return res.status(400).json({ message: "Cannot endorse yourself" });

  const endorsee = await User.findById(userId);
  if (!endorsee) return res.status(404).json({ message: "User not found" });
  if (!endorsee.skills.includes(skill))
    return res.status(400).json({ message: "User does not list this skill" });

  try {
    await Endorsement.create({ endorser: req.user._id, endorsee: userId, skill });
    res.status(201).json({ message: "Endorsed successfully" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Already endorsed this skill" });
    throw err;
  }
};

const removeEndorsement = async (req, res) => {
  const { skill } = req.body;
  const { userId } = req.params;
  await Endorsement.findOneAndDelete({ endorser: req.user._id, endorsee: userId, skill });
  res.json({ message: "Endorsement removed" });
};

const getEndorsements = async (req, res) => {
  const endorsements = await Endorsement.find({ endorsee: req.params.userId });
  const grouped = {};
  for (const e of endorsements) {
    if (!grouped[e.skill]) grouped[e.skill] = { count: 0, endorserIds: [] };
    grouped[e.skill].count++;
    grouped[e.skill].endorserIds.push(e.endorser.toString());
  }
  res.json(grouped);
};

module.exports = { endorseSkill, removeEndorsement, getEndorsements };
