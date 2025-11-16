module.exports = function validateCategory(req, res, next) {
  const allowed = ['label', 'baseUrl', 'maxPrice', 'keywords', 'name', 'active'];
  const bodyKeys = Object.keys(req.body || {});
  for (const k of bodyKeys) {
    if (!allowed.includes(k)) return res.status(400).json({ ok: false, error: `Unexpected field: ${k}` });
  }

  const { label, baseUrl, maxPrice, keywords, active } = req.body;
  if (req.method === 'POST') {
    if (!label || !baseUrl || typeof maxPrice === 'undefined') return res.status(400).json({ ok: false, error: 'label, baseUrl, maxPrice are required' });
  }

  if (keywords && (!Array.isArray(keywords) || keywords.length > 10)) {
    return res.status(400).json({ ok: false, error: 'keywords must be an array with at most 10 items' });
  }

  if (typeof active !== 'undefined' && typeof active !== 'boolean') {
    return res.status(400).json({ ok: false, error: 'active must be a boolean' });
  }

  next();
};
