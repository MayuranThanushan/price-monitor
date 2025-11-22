const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/alertController');

router.use(auth);
router.get('/', ctrl.list);
router.post('/mark-all-read', ctrl.markAllRead);
router.post('/:id/read', ctrl.markRead);

module.exports = router;
