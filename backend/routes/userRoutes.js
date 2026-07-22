const express = require("express");
const router = express.Router();
const { getAllUsers, getProfile, updateProfile, getPublicProfile } = require("../controllers/userController");
const { endorseSkill, removeEndorsement, getEndorsements } = require("../controllers/endorsementController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllUsers);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/:userId", getPublicProfile);
router.get("/:userId/endorsements", getEndorsements);
router.post("/:userId/endorse", protect, endorseSkill);
router.delete("/:userId/endorse", protect, removeEndorsement);

module.exports = router;
