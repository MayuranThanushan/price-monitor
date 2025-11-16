const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    // provide a clearer error message when JWT_SECRET is missing
    throw new Error('JWT_SECRET is not configured. Please set JWT_SECRET in your environment or .env file');
  }
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'email and password required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ ok: false, error: 'email already exists' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ ok: true, token: signToken(user), user: { id: user._id, email: user.email, name: user.name } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, error: 'email and password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ ok: false, error: 'invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ ok: false, error: 'invalid credentials' });
  res.json({ ok: true, token: signToken(user), user: { id: user._id, email: user.email, name: user.name } });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ ok: true, user });
};
