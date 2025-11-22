const scraperService = require('../services/scraperService');
const emailService = require('../services/emailService');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Offer = require('../models/Offer');
const Tracker = require('../models/Category');

exports.runScrape = async (req, res) => {
  const result = await scraperService.runAllActiveScrapers();
  res.json({ ok: true, result });
};

exports.testEmail = async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ ok: false, error: 'to required' });
  await emailService.sendEmail({ to, type: 'test' });
  res.json({ ok: true });
};

// Verify email transport configuration
exports.verifyEmail = async (_req, res) => {
  const result = await emailService.verifyTransport();
  if (!result.ok) return res.status(500).json({ ok: false, error: result.error });
  res.json({ ok: true, message: 'Email transport verified' });
};

// List all users (admin only)
exports.listUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ ok: true, data: users });
};

// Aggregate alerts across all users
exports.listAllAlerts = async (req, res) => {
  const alerts = await Alert.find({}).sort({ createdAt: -1 }).limit(500);
  res.json({ ok: true, data: alerts });
};

// Aggregate offers (assuming Offer model holds offers independent of user)
exports.listAllOffers = async (req, res) => {
  const offers = await Offer.find({}).sort({ createdAt: -1 }).limit(500);
  res.json({ ok: true, data: offers });
};

// Aggregate trackers (categories) across all users
exports.listAllTrackers = async (req, res) => {
  const trackers = await Tracker.find({}).sort({ createdAt: -1 }).limit(500);
  res.json({ ok: true, data: trackers });
};

// Reset all users and optionally seed provided users (secured via seedAuth)
exports.resetUsers = async (req, res) => {
  const { users = [] } = req.body || {};
  await User.deleteMany({});
  const created = [];
  for (const u of users) {
    if (!u.email || !u.password) continue; // skip invalid entries
    try {
      const doc = await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role === 'admin' ? 'admin' : 'user'
      });
      created.push({ id: doc._id, email: doc.email, role: doc.role });
    } catch (e) {
      // ignore individual creation errors to allow bulk processing
    }
  }
  res.json({ ok: true, deletedAll: true, seededCount: created.length, users: created });
};

// Delete a single user by id (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ ok: false, error: 'id required' });
  if (req.user && String(req.user.id) === String(id)) {
    return res.status(400).json({ ok: false, error: 'Cannot delete your own account via admin endpoint.' });
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ ok: false, error: 'User not found' });
  res.json({ ok: true, deleted: { id: deleted._id, email: deleted.email } });
};

// Update a user (admin only)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ ok: false, error: 'id required' });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
  const { name, email, role, password, scrapeIntervalMinutes, timeZone, cards } = req.body || {};
  if (email) user.email = email.toLowerCase().trim();
  if (name !== undefined) user.name = name;
  if (role) {
    if (!['user','admin'].includes(role)) return res.status(400).json({ ok: false, error: 'Invalid role' });
    user.role = role;
  }
  if (scrapeIntervalMinutes !== undefined) user.scrapeIntervalMinutes = scrapeIntervalMinutes;
  if (timeZone !== undefined) user.timeZone = timeZone;
  if (Array.isArray(cards)) user.cards = cards;
  if (password) user.password = password; // will hash via pre-save hook
  await user.save();
  const safe = user.toObject();
  delete safe.password;
  res.json({ ok: true, user: safe });
};

// Reset a user's password and email them a temporary one (admin only)
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ ok: false, error: 'id required' });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
  const temp = 'TMP-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  user.password = temp;
  await user.save();
  try {
    await emailService.sendEmail({
      to: user.email,
      type: 'reset_password_admin',
      data: { temp, name: user.name }
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Email failed to send' });
  }
  res.json({ ok: true, message: 'Temporary password emailed' });
};

// Endpoint list (static metadata). Keep in sync with routes.
exports.listEndpoints = async (_req, res) => {
  const endpoints = [
    // Auth
    { method: 'POST', path: '/api/auth/login', purpose: 'Authenticate user' },
    { method: 'POST', path: '/api/auth/register', purpose: 'Register user (admin only)' },
    { method: 'GET', path: '/api/auth/me', purpose: 'Current user details' },
    { method: 'PUT', path: '/api/auth/update', purpose: 'Update current user' },
    // Trackers
    { method: 'GET', path: '/api/trackers', purpose: 'List trackers' },
    { method: 'POST', path: '/api/trackers', purpose: 'Create tracker' },
    { method: 'PUT', path: '/api/trackers/:id', purpose: 'Update tracker' },
    { method: 'DELETE', path: '/api/trackers/:id', purpose: 'Delete tracker' },
    // Categories
    { method: 'GET', path: '/api/categories', purpose: 'List categories' },
    { method: 'GET', path: '/api/categories/stats', purpose: 'Category/Tracker aggregated stats' },
    { method: 'POST', path: '/api/categories', purpose: 'Create category' },
    { method: 'PUT', path: '/api/categories/:id', purpose: 'Update category' },
    { method: 'DELETE', path: '/api/categories/:id', purpose: 'Delete category' },
    // Products
    { method: 'GET', path: '/api/products/:categoryId', purpose: 'List products for tracker/category' },
    { method: 'GET', path: '/api/products/history/:productId', purpose: 'Product price history' },
    { method: 'POST', path: '/api/products/scrape', purpose: 'Trigger scrape for user categories' },
    // Offers
    { method: 'GET', path: '/api/offers/grouped', purpose: 'List offers grouped by shop' },
    { method: 'GET', path: '/api/offers/sources', purpose: 'List offer sources' },
    { method: 'POST', path: '/api/offers/sources', purpose: 'Create offer source' },
    { method: 'PUT', path: '/api/offers/sources/:id', purpose: 'Update offer source' },
    { method: 'DELETE', path: '/api/offers/sources/:id', purpose: 'Delete offer source' },
    // Alerts
    { method: 'GET', path: '/api/alerts', purpose: 'List alerts' },
    { method: 'POST', path: '/api/alerts/mark-all-read', purpose: 'Mark all alerts read' },
    { method: 'POST', path: '/api/alerts/:id/read', purpose: 'Mark alert read' },
    // Metrics
    { method: 'GET', path: '/api/metrics/dashboard', purpose: 'Dashboard metrics' },
    // Admin aggregate (admin only)
    { method: 'POST', path: '/api/admin/scrape', purpose: 'Run all scrapers (admin)' },
    { method: 'POST', path: '/api/admin/email-test', purpose: 'Send test email (admin)' },
    { method: 'GET', path: '/api/admin/email-verify', purpose: 'Verify email transport (admin)' },
    { method: 'GET', path: '/api/admin/email-verify', purpose: 'Verify email transport (admin)' },
    { method: 'GET', path: '/api/admin/users', purpose: 'List all users (admin)' },
    { method: 'DELETE', path: '/api/admin/users/:id', purpose: 'Delete user (admin)' },
    { method: 'PUT', path: '/api/admin/users/:id', purpose: 'Update user (admin)' },
    { method: 'POST', path: '/api/admin/users/:id/reset-password', purpose: 'Reset user password & email temp (admin)' },
    { method: 'POST', path: '/api/admin/users/reset', purpose: 'Reset & seed users (admin)' },
    { method: 'GET', path: '/api/admin/alerts', purpose: 'All alerts aggregated (admin)' },
    { method: 'GET', path: '/api/admin/offers', purpose: 'All offers aggregated (admin)' },
    { method: 'GET', path: '/api/admin/trackers', purpose: 'All trackers aggregated (admin)' },
    { method: 'GET', path: '/api/admin/endpoints', purpose: 'List all endpoints metadata (admin)' },
  ];
  res.json({ ok: true, data: endpoints });
};

// Force resend latest alert email (admin helper)
exports.resendLatestAlertEmail = async (req, res) => {
  const latest = await Alert.findOne({}).sort({ createdAt: -1 }).populate('userId');
  if (!latest) return res.status(404).json({ ok: false, error: 'No alerts found' });
  const user = latest.userId;
  try {
    const subject = `Price Monitor Alert — ${latest.productTitle}`;
    const to = user?.email || process.env.EMAIL_USER;
    let text;
    if (latest.type === 'drop') {
      text = `Price drop: ${latest.oldPrice} -> ${latest.newPrice}\nLink: ${latest.productUrl}`;
    } else {
      text = `Price below threshold: ${latest.newPrice}\nLink: ${latest.productUrl}`;
    }
    await emailService.sendEmail({ to, type: 'alert_single', data: { title: latest.productTitle, type: latest.type, oldPrice: latest.oldPrice, newPrice: latest.newPrice, url: latest.productUrl, name: user?.name } });
    latest.emailedAt = new Date();
    await latest.save();
    res.json({ ok: true, alertId: latest._id, emailedAt: latest.emailedAt });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
};
