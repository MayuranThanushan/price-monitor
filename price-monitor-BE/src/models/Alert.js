const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  trackerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tracker' },
  productTitle: { type: String, required: true },
  productUrl: { type: String },
  type: { type: String, enum: ['drop','below_threshold'], required: true },
  oldPrice: { type: Number },
  newPrice: { type: Number, required: true },
  read: { type: Boolean, default: false },
  emailedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
