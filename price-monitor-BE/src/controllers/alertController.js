const Alert = require('../models/Alert');

exports.list = async (req, res) => {
  const { unread } = req.query;
  const filter = { userId: req.user.id };
  if (unread === 'true') filter.read = false;
  const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ ok: true, data: alerts });
};

exports.markRead = async (req, res) => {
  const id = req.params.id;
  const alert = await Alert.findOneAndUpdate({ _id: id, userId: req.user.id }, { read: true }, { new: true });
  if (!alert) return res.status(404).json({ ok: false, error: 'Alert not found' });
  res.json({ ok: true, data: alert });
};

exports.markAllRead = async (req, res) => {
  await Alert.updateMany({ userId: req.user.id, read: false }, { read: true });
  res.json({ ok: true });
};
