const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

const markAsRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.json({ message: "All notifications marked as read" });
};

module.exports = { getNotifications, markAsRead };
