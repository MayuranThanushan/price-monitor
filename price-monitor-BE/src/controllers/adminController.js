const scraperService = require('../services/scraperService');
const emailService = require('../services/emailService');

exports.runScrape = async (req, res) => {
  const result = await scraperService.runAllActiveScrapers();
  res.json({ ok: true, result });
};

exports.testEmail = async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ ok: false, error: 'to required' });
  await emailService.sendEmail({ to, subject: 'Price Monitor Test', text: 'This is a test' });
  res.json({ ok: true });
};
