const Tracker = require('../models/Tracker');
const Category = require('../models/Category');

exports.list = async (req, res) => {
  const trackers = await Tracker.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ ok: true, data: trackers });
};

exports.create = async (req, res) => {
  const { name, baseUrl, categories = [], keywords = [], maxPrice } = req.body;
  if (!name || !baseUrl) return res.status(400).json({ ok: false, error: 'name and baseUrl required' });
  const tracker = await Tracker.create({ userId: req.user.id, name, baseUrl, categories, keywords: keywords.slice(0,15), maxPrice });
  res.status(201).json({ ok: true, data: tracker });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { name, baseUrl, categories, keywords, maxPrice, active } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (baseUrl !== undefined) update.baseUrl = baseUrl;
  if (Array.isArray(categories)) update.categories = categories;
  if (Array.isArray(keywords)) update.keywords = keywords.slice(0,15);
  if (maxPrice !== undefined) update.maxPrice = maxPrice;
  if (active !== undefined) update.active = active;
  const tracker = await Tracker.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true });
  if (!tracker) return res.status(404).json({ ok: false, error: 'Tracker not found' });
  res.json({ ok: true, data: tracker });
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await Tracker.findOneAndDelete({ _id: id, userId: req.user.id });
  res.json({ ok: true });
};
