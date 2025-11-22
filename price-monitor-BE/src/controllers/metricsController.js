const Category = require('../models/Category');
const Product = require('../models/Product');
const Alert = require('../models/Alert');

exports.dashboard = async (req, res) => {
  const userId = req.user.id;
  const categories = await Category.find({ userId }).select('_id').lean();
  const catIds = categories.map(c => c._id);
  const productsTracked = catIds.length ? await Product.countDocuments({ categoryId: { $in: catIds } }) : 0;
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const alertsToday = await Alert.countDocuments({ userId, createdAt: { $gte: startOfDay } });
  res.json({ ok: true, data: { activeTrackers: categories.length, productsTracked, alertsToday } });
};
