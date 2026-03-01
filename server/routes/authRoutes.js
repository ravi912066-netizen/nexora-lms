const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, approveUser, verifyOtp, updateProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const multer = require('multer');

// Multer Config for Profile Pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/profile-picture', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const filePath = `/uploads/${req.file.filename}`;

        const user = await User.findById(req.user._id);
        user.profilePicture = filePath;
        await user.save();

        res.json({ profilePicture: filePath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all students (Admin)
router.get('/students', protect, admin, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Approve User (Admin)
router.put('/approve/:id', protect, admin, approveUser);

module.exports = router;
