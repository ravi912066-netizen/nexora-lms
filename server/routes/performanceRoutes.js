const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Performance = require('../models/Performance');
const User = require('../models/User');

// Get personal performance (Student)
router.get('/me', protect, async (req, res) => {
    try {
        let perf = await Performance.findOne({ studentId: req.user._id }).populate('lecturesCompleted');
        if (!perf) {
            perf = await Performance.create({ studentId: req.user._id });
        }
        res.json(perf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get leaderboard
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const leaderboard = await Performance.find()
            .populate('studentId', 'name email')
            .sort({ totalXP: -1 })
            .limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get overall analytics (Admin)
router.get('/analytics', protect, admin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Aggregate total XP sum
        const xpStats = await Performance.aggregate([
            { $group: { _id: null, totalGlobalXP: { $sum: "$totalXP" } } }
        ]);

        res.json({
            totalStudents,
            totalAdmins,
            totalGlobalXP: xpStats.length > 0 ? xpStats[0].totalGlobalXP : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Get detailed report for a specific student (Admin)
router.get('/admin/student/:id', protect, admin, async (req, res) => {
    try {
        const studentId = req.params.id;
        const user = await User.findById(studentId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const performance = await Performance.findOne({ studentId });
        const submissions = await Submission.find({ studentId });
        const allAssignments = await Assignment.find().populate('courseId', 'title');

        // Map assignments to show status (pending, completed, unviewed)
        const assignmentsWithStatus = allAssignments.map(assignment => {
            const submission = submissions.find(s => s.assignmentId.toString() === assignment._id.toString());
            const hasViewed = assignment.viewedBy.includes(studentId);

            let status = 'unopened';
            if (submission && submission.status === 'completed') status = 'completed';
            else if (hasViewed) status = 'viewed';

            return {
                _id: assignment._id,
                title: assignment.title,
                courseId: assignment.courseId,
                status: status,
                viewed: hasViewed,
                submittedAt: submission ? submission.submittedAt : null
            };
        });

        res.json({
            user,
            performance: performance || { totalXP: 0, assignmentsCompleted: 0 },
            assignments: assignmentsWithStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark lecture as completed (Student)
router.post('/lecture/:id', protect, async (req, res) => {
    try {
        let perf = await Performance.findOne({ studentId: req.user._id });
        if (!perf) {
            perf = await Performance.create({ studentId: req.user._id });
        }

        if (!perf.lecturesCompleted.includes(req.params.id)) {
            perf.lecturesCompleted.push(req.params.id);
            perf.totalXP += 10; // Award 10 XP for each lecture
            await perf.save();
        }
        res.json({ message: 'Lecture marked as completed', totalXP: perf.totalXP });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
