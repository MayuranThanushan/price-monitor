const mongoose = require('mongoose');

const OfferSourceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bank: { type: String, required: true },
  cardType: { type: String, enum: ['credit','debit','both'], default: 'both' },
  // For single cardType (credit|debit) backwards compatible field
  url: { type: String },
  // When cardType === 'both', store separate URLs
  urlCredit: { type: String },
  urlDebit: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('OfferSource', OfferSourceSchema);
