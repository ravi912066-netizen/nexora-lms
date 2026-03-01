const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Performance = require('../models/Performance');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Get assignments for a course (Student/Admin)
router.get('/course/:courseId', protect, async (req, res) => {
    try {
        const assignments = await Assignment.find({ courseId: req.params.courseId });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create assignment (Admin only)
router.post('/', protect, admin, async (req, res) => {
    const { courseId, title, description, problemUrl, documentUrl, xp, type } = req.body;
    try {
        const assignment = await Assignment.create({ courseId, title, description, problemUrl, documentUrl, xp, type });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit assignment (Student) - Supports Files + Attachments
router.post('/:id/submit', protect, upload.array('files'), async (req, res) => {
    try {
        const { url, code, attachments: attachmentsRaw } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            studentId: req.user._id,
            assignmentId: req.params.id
        });

        if (existingSubmission) {
            return res.status(400).json({ message: 'Already submitted' });
        }

        // Parse attachments if they come as stringified JSON
        let attachments = [];
        if (attachmentsRaw) {
            try {
                attachments = typeof attachmentsRaw === 'string' ? JSON.parse(attachmentsRaw) : attachmentsRaw;
            } catch (e) {
                console.error("Error parsing attachments", e);
            }
        }

        // Add uploaded files to attachments
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                attachments.push({
                    type: 'file',
                    value: `/uploads/${file.filename}`,
                    name: file.originalname
                });
            });
        }

        const submission = await Submission.create({
            studentId: req.user._id,
            assignmentId: req.params.id,
            score: assignment.xp,
            url: url || '',
            code: code || '',
            attachments: attachments,
            status: 'completed',
            submittedAt: new Date()
        });

        // Update performance
        let perf = await Performance.findOne({ studentId: req.user._id });
        if (!perf) {
            perf = await Performance.create({ studentId: req.user._id });
        }

        perf.assignmentsCompleted += 1;
        perf.totalXP += assignment.xp;
        await perf.save();

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get all submissions
router.get('/submissions', protect, admin, async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('studentId', 'name email')
            .populate({
                path: 'assignmentId',
                select: 'title courseId',
                populate: { path: 'courseId', select: 'title' }
            })
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student: Mark assignment as viewed
router.post('/:id/view', protect, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        if (!assignment.viewedBy.includes(req.user._id)) {
            assignment.viewedBy.push(req.user._id);
            await assignment.save();
        }
        res.json({ message: 'View recorded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
