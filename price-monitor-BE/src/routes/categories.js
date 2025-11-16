const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');
const validateCategory = require('../middleware/validateCategory');

router.use(auth);
router.get('/', ctrl.list);
router.post('/', validateCategory, ctrl.create);
router.put('/:id', validateCategory, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
