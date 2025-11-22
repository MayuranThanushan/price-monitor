const Category = require('../models/Category');
const Product = require('../models/Product');
const Alert = require('../models/Alert');

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

exports.stats = async (req, res) => {
  // Fetch user categories
  const categories = await Category.find({ userId: req.user.id }).lean();
  if (!categories.length) return res.json({ ok: true, data: [] });
  const ids = categories.map(c => c._id);
  // Fetch products for these categories
  const products = await Product.find({ categoryId: { $in: ids } }).lean();
  // Build stats map
  const statsMap = {};
  for (const c of categories) {
    statsMap[c._id] = {
      _id: c._id,
      label: c.label,
      name: c.name,
      baseUrl: c.baseUrl,
      maxPrice: c.maxPrice,
      active: c.active,
      productCount: 0,
      lowestPrice: null,
      highestPrice: null,
      avgPrice: null,
      lastUpdated: null,
      alertsToday: 0
    };
  }
  for (const p of products) {
    const s = statsMap[p.categoryId];
    if (!s) continue;
    s.productCount++;
    s.lowestPrice = (s.lowestPrice == null || p.currentPrice < s.lowestPrice) ? p.currentPrice : s.lowestPrice;
    s.highestPrice = (s.highestPrice == null || p.currentPrice > s.highestPrice) ? p.currentPrice : s.highestPrice;
    s.avgPrice = s.avgPrice == null ? p.currentPrice : ((s.avgPrice * (s.productCount - 1) + p.currentPrice) / s.productCount);
    if (!s.lastUpdated || new Date(p.updatedAt) > new Date(s.lastUpdated)) s.lastUpdated = p.updatedAt;
  }
  // Alerts today per category
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const alerts = await Alert.find({ userId: req.user.id, createdAt: { $gte: startOfDay } }).lean();
  for (const a of alerts) {
    if (a.categoryId && statsMap[a.categoryId]) statsMap[a.categoryId].alertsToday++;
  }
  res.json({ ok: true, data: Object.values(statsMap) });
};
