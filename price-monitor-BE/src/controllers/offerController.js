const Offer = require('../models/Offer');
const OfferSource = require('../models/OfferSource');

exports.listGroupedByShop = async (req, res) => {
  const offers = await Offer.find({}).sort({ highlighted: -1, createdAt: -1 }).lean();
  const grouped = offers.reduce((acc, o) => {
    acc[o.shop] = acc[o.shop] || [];
    acc[o.shop].push(o);
    return acc;
  }, {});
  res.json({ ok: true, data: grouped });
};

exports.listSources = async (req, res) => {
  const sources = await OfferSource.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ ok: true, data: sources });
};

exports.createSource = async (req, res) => {
  const { bank, cardType = 'both', url, urlCredit, urlDebit, active = true } = req.body;
  if (!bank) return res.status(400).json({ ok: false, error: 'bank required' });
  if (cardType === 'both') {
    if (!urlCredit || !urlDebit) return res.status(400).json({ ok: false, error: 'urlCredit and urlDebit required for both card types' });
    const src = await OfferSource.create({ userId: req.user.id, bank, cardType, urlCredit, urlDebit, active });
    return res.status(201).json({ ok: true, data: src });
  }
  if (!url) return res.status(400).json({ ok: false, error: 'url required for single card type' });
  const src = await OfferSource.create({ userId: req.user.id, bank, cardType, url, active });
  res.status(201).json({ ok: true, data: src });
};

exports.updateSource = async (req, res) => {
  const id = req.params.id;
  const { bank, cardType, url, urlCredit, urlDebit, active } = req.body;
  const update = {};
  if (bank !== undefined) update.bank = bank;
  if (cardType !== undefined) update.cardType = cardType;
  if (cardType === 'both') {
    if (urlCredit !== undefined) update.urlCredit = urlCredit;
    if (urlDebit !== undefined) update.urlDebit = urlDebit;
    // Clear single url if switching to both
    if (cardType !== undefined) update.url = undefined;
  } else {
    if (url !== undefined) update.url = url;
    // Clear separate urls if switching away from both
    if (cardType !== undefined) { update.urlCredit = undefined; update.urlDebit = undefined; }
  }
  if (active !== undefined) update.active = active;
  const src = await OfferSource.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true });
  if (!src) return res.status(404).json({ ok: false, error: 'Offer source not found' });
  res.json({ ok: true, data: src });
};

exports.removeSource = async (req, res) => {
  const id = req.params.id;
  await OfferSource.findOneAndDelete({ _id: id, userId: req.user.id });
  res.json({ ok: true });
};
