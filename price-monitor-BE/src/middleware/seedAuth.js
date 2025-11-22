// Allows access if a valid seed key header is present OR falls back to standard admin auth.
// Header: x-seed-key must equal process.env.SEED_KEY
const auth = require('./auth');
const requireAdmin = require('./requireAdmin');

module.exports = async (req, res, next) => {
  const seedKey = req.headers['x-seed-key'];
  if (seedKey && process.env.SEED_KEY && seedKey === process.env.SEED_KEY) {
    // bypass normal auth for seeding
    return next();
  }
  // fallback to normal admin authentication
  return auth(req, res, function(){
    requireAdmin(req, res, next);
  });
};