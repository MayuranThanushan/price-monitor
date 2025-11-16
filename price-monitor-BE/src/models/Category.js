const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, required: true },
  baseUrl: { type: String, required: true },
  name: { type: String },
  maxPrice: { type: Number, required: true },
  keywords: { type: [String], default: [], validate: [(v) => v.length <= 10, 'Keywords cannot exceed 10 items'] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
