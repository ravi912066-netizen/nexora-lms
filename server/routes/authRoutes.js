const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, approveUser, verifyOtp, updateProfile, initiateCall, endCall } = require('../controllers/authController');
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

// 1-on-1 Video Call (Admin)
router.put('/call/start/:id', protect, admin, initiateCall);
router.put('/call/end/:id', protect, admin, endCall);

// Reject User (Admin)
router.put('/reject/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User rejected and removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Coding Platform Stats (real API)
router.get('/coding-stats/:handle/:platform', protect, async (req, res) => {
    const { handle, platform } = req.params;
    try {
        const axios = require('axios');
        if (platform === 'codeforces') {
            const cfRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`, { timeout: 5000 });
            if (cfRes.data.status !== 'OK') return res.status(404).json({ error: 'User not found' });
            const u = cfRes.data.result[0];
            // Get problem stats
            let solved = 0;
            try {
                const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`, { timeout: 5000 });
                if (subRes.data.status === 'OK') {
                    const unique = new Set(subRes.data.result.filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}-${s.problem.index}`));
                    solved = unique.size;
                }
            } catch (_) { }
            return res.json({
                platform: 'codeforces',
                handle,
                rating: u.rating || 0,
                maxRating: u.maxRating || 0,
                rank: u.rank || 'unranked',
                maxRank: u.maxRank || 'unranked',
                solved,
                avatar: u.avatar,
            });
        }
        if (platform === 'leetcode') {
            try {
                const lcRes = await axios.get(`https://leetcode-stats-api.herokuapp.com/${handle}`, { timeout: 5000 });
                if (lcRes.data.status === 'error') return res.status(404).json({ error: 'User not found' });
                return res.json({
                    platform: 'leetcode',
                    handle,
                    totalSolved: lcRes.data.totalSolved || 0,
                    easySolved: lcRes.data.easySolved || 0,
                    mediumSolved: lcRes.data.mediumSolved || 0,
                    hardSolved: lcRes.data.hardSolved || 0,
                    ranking: lcRes.data.ranking || 0,
                    contributionPoints: lcRes.data.contributionPoints || 0,
                });
            } catch (_) {
                return res.json({ platform: 'leetcode', handle, totalSolved: 0, error: 'API limit hit' });
            }
        }
        res.status(400).json({ error: 'Unknown platform' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
