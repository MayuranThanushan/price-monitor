const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional if offers are global
  shop: { type: String, required: true },
  bank: { type: String, required: true },
  cardType: { type: String, enum: ['credit','debit','both'], default: 'both' },
  title: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percent','amount','cashback','other'], default: 'other' },
  discountValue: { type: Number },
  expiresAt: { type: Date },
  sourceUrl: { type: String },
  highlighted: { type: Boolean, default: false }
}, { timestamps: true });

OfferSchema.index({ shop: 1, bank: 1, title: 1 }, { unique: false });

module.exports = mongoose.model('Offer', OfferSchema);
