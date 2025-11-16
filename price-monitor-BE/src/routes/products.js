const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/productController');

router.use(auth);
router.get('/:categoryId', ctrl.getByCategory);
router.get('/history/:productId', ctrl.getHistory);

// manual scrape for all user's categories
router.post('/scrape', ctrl.scrapeUserCategories);

module.exports = router;
