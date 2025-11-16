const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  url: { type: String },
  image: { type: String },
  currentPrice: { type: Number, required: true },
  lastPrice: { type: Number, default: 0 },
  difference: { type: Number, default: 0 },
  trend: { type: String, enum: ['UP','DOWN','SAME'], default: 'SAME' },
  lastChecked: { type: Date, default: Date.now }
}, { timestamps: true });

ProductSchema.index({ categoryId: 1, url: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Product', ProductSchema);
