const Category = require('../models/Category');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const scraperService = require('../services/scraperService');

exports.getByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const products = await Product.find({ categoryId }).sort({ lastChecked: -1 });
  res.json({ ok: true, data: products });
};

exports.getHistory = async (req, res) => {
  const productId = req.params.productId;
  const history = await PriceHistory.find({ productId }).sort({ date: 1 });
  res.json({ ok: true, data: history.map(h => ({ date: h.date, price: h.price })) });
};

exports.scrapeUserCategories = async (req, res) => {
  const categories = await Category.find({ userId: req.user.id, active: true }).lean();
  const summary = [];
  for (const cat of categories) {
    const result = await scraperService.runForCategory(cat, req.user);
    summary.push(result);
  }
  res.json({ ok: true, summary });
};
