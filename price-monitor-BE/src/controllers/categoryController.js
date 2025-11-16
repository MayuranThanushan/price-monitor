const Category = require('../models/Category');

exports.list = async (req, res) => {
  const categories = await Category.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ ok: true, data: categories });
};

exports.create = async (req, res) => {
  // Accept only the common fields: baseUrl, label, keywords (max 10), maxPrice, name, active
  const { label, baseUrl, maxPrice, keywords, active, name } = req.body;
  if (!label || !baseUrl || typeof maxPrice === 'undefined') return res.status(400).json({ ok: false, error: 'label, baseUrl, maxPrice are required' });
  const kws = Array.isArray(keywords) ? keywords.slice(0, 10) : [];
  const cat = await Category.create({ userId: req.user.id, label, baseUrl, name, maxPrice, keywords: kws, active: active ?? true });
  res.status(201).json({ ok: true, data: cat });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  // Whitelist allowed fields to avoid URL-specific or unexpected values
  const { label, baseUrl, maxPrice, keywords, active, name } = req.body;
  const update = {};
  if (typeof label !== 'undefined') update.label = label;
  if (typeof baseUrl !== 'undefined') update.baseUrl = baseUrl;
  if (typeof name !== 'undefined') update.name = name;
  if (typeof maxPrice !== 'undefined') update.maxPrice = maxPrice;
  if (typeof active !== 'undefined') update.active = active;
  if (Array.isArray(keywords)) update.keywords = keywords.slice(0, 10);

  const cat = await Category.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true, runValidators: true });
  if (!cat) return res.status(404).json({ ok: false, error: 'Category not found' });
  res.json({ ok: true, data: cat });
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await Category.findOneAndDelete({ _id: id, userId: req.user.id });
  res.json({ ok: true });
};
