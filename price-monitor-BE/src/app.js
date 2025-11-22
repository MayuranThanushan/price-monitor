const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const requestLogger = require('./middleware/requestLogger');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const trackerRoutes = require('./routes/trackers');
const offerRoutes = require('./routes/offers');
const alertRoutes = require('./routes/alerts');
const metricsRoutes = require('./routes/metrics');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger); // custom JSON access log to logs/access.log

// routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/trackers', trackerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/admin', adminRoutes);

// health & error handler
app.get('/api/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ ok: false, error: err.message || 'Internal Server Error' });
});

module.exports = app;
