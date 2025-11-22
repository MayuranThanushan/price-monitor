const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  baseUrl: { type: String, required: true },
  categories: { type: [String], default: [] }, // optional sub-category names or paths
  keywords: { type: [String], default: [], validate: [(v) => v.length <= 15, 'Keywords cannot exceed 15 items'] },
  maxPrice: { type: Number },
  active: { type: Boolean, default: true },
  lastRunAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Tracker', TrackerSchema);
