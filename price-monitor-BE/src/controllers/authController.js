const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    // provide a clearer error message when JWT_SECRET is missing
    throw new Error('JWT_SECRET is not configured. Please set JWT_SECRET in your environment or .env file');
  }
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
}

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'email and password required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ ok: false, error: 'email already exists' });
  // role is optional; only allow admin to create an admin user (caller guaranteed admin by route middleware)
  const createRole = role === 'admin' ? 'admin' : 'user';
  const user = await User.create({ name, email, password, role: createRole });
  res.status(201).json({ ok: true, token: signToken(user), user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'email and password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ ok: false, error: 'invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ ok: false, error: 'invalid credentials' });
  res.json({ ok: true, token: signToken(user), user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ ok: true, user });
};

exports.update = async (req, res) => {
  const id = req.user.id;
  const { name, email, password, scrapeIntervalMinutes, timeZone, cards } = req.body;
  const update = {};
  if (typeof name !== 'undefined') update.name = name;
  if (typeof email !== 'undefined') update.email = email;
  if (typeof scrapeIntervalMinutes !== 'undefined') update.scrapeIntervalMinutes = scrapeIntervalMinutes;
  if (typeof timeZone !== 'undefined') update.timeZone = timeZone;
  if (Array.isArray(cards)) update.cards = cards;

  // If password provided, set it so pre-save hook hashes it
  if (typeof password !== 'undefined' && password) update.password = password;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

  Object.assign(user, update);
  await user.save();

  const out = user.toObject();
  delete out.password;
  res.json({ ok: true, user: out });
};

// Public forgot password: generate temporary password and email it
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: 'email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ ok: true, message: 'If that email exists, a reset was sent.' });
  // generate temp password
  const temp = Math.random().toString(36).slice(-10) + '!';
  user.password = temp; // will be hashed by pre-save
  await user.save();
  try {
    await emailService.sendEmail({
      to: email,
      subject: 'Your Price Monitor Temporary Password',
      text: `Temporary password: ${temp}\nPlease log in and change it immediately.`
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
  res.json({ ok: true, message: 'Temporary password sent if email exists.' });
};
