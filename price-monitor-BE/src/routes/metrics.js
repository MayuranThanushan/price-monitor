const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/metricsController');

router.use(auth);
router.get('/dashboard', ctrl.dashboard);

module.exports = router;
