const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { askQuestion, getMyDoubts, getAllDoubts, resolveDoubt } = require('../controllers/profileDoubtController');

router.post('/', protect, askQuestion);
router.get('/my', protect, getMyDoubts);
router.get('/all', protect, admin, getAllDoubts);
router.put('/:id/resolve', protect, admin, resolveDoubt);

module.exports = router;
