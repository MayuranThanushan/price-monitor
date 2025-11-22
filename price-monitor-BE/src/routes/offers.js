const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/offerController');

router.use(auth);
router.get('/grouped', ctrl.listGroupedByShop);
router.get('/sources', ctrl.listSources);
router.post('/sources', ctrl.createSource);
router.put('/sources/:id', ctrl.updateSource);
router.delete('/sources/:id', ctrl.removeSource);

module.exports = router;
