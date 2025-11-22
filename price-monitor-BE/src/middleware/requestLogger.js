const fs = require('fs');
const path = require('path');

module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ipHeader = req.headers['x-forwarded-for'];
    const ip = (ipHeader && ipHeader.split(',')[0].trim()) || req.ip || 'unknown';
    const userIdent = (req.user && (req.user.email || req.user.id)) || 'anonymous';
    const logEntry = {
      ts: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
      ip,
      user: userIdent
    };
    const line = JSON.stringify(logEntry) + '\n';
    const logDir = path.join(__dirname, '..', 'logs');
    fs.mkdir(logDir, { recursive: true }, (err) => {
      if (err) return; // silently ignore
      fs.appendFile(path.join(logDir, 'access.log'), line, () => {});
    });
  });
  next();
};