const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.use(auth);
router.post('/scrape', ctrl.runScrape);      // manual full run (all users)
router.post('/email-test', ctrl.testEmail);  // body { to } - sends test to your email

module.exports = router;
