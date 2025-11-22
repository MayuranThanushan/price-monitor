const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/adminController');
const requireAdmin = require('../middleware/requireAdmin');

// Seeding/reset route now restricted to authenticated admin only
router.post('/users/reset', auth, requireAdmin, ctrl.resetUsers);

router.use(auth, requireAdmin);
router.post('/scrape', ctrl.runScrape);        // manual full run (all users)
router.post('/email-test', ctrl.testEmail);    // body { to }
router.get('/email-verify', ctrl.verifyEmail); // verify transporter
router.get('/users', ctrl.listUsers);          // list all users
router.put('/users/:id', ctrl.updateUser);     // update user
router.post('/users/:id/reset-password', ctrl.resetPassword); // reset user password
router.delete('/users/:id', ctrl.deleteUser);  // delete user
router.get('/alerts', ctrl.listAllAlerts);     // list all alerts
router.post('/alerts/resend-latest', ctrl.resendLatestAlertEmail); // resend latest alert email
router.get('/offers', ctrl.listAllOffers);     // list all offers
router.get('/trackers', ctrl.listAllTrackers); // list all trackers
router.get('/endpoints', ctrl.listEndpoints);  // list all endpoints metadata

module.exports = router;
