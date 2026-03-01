const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    requestEnrollment,
    getPendingEnrollments,
    updateEnrollmentStatus,
    getMyEnrollments,
    getPaymentInfo
} = require('../controllers/enrollmentController');

// Multer for Payment Screenshots
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/request', protect, upload.single('screenshot'), requestEnrollment);
router.get('/my', protect, getMyEnrollments);
router.get('/admin/pending', protect, admin, getPendingEnrollments);
router.put('/admin/status/:id', protect, admin, updateEnrollmentStatus);
router.get('/payment-info', protect, getPaymentInfo); // Added for students to see where to pay

module.exports = router;
