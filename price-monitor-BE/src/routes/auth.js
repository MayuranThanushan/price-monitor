const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const requireAdmin = require('../middleware/requireAdmin');
const auth = require('../middleware/auth');

// Registration restricted to admin; admin must be authenticated and have role admin
router.post('/register', auth, requireAdmin, register);
router.post('/login', login);
router.get('/me', auth, me);
router.put('/update', auth, require('../controllers/authController').update);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);

module.exports = router;
