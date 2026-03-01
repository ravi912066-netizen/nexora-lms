const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

// Get all courses (Student/Admin)
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a course (Admin only)
router.post('/', protect, admin, async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const course = await Course.create({
            title,
            description,
            price: price || 0,
            instructor: req.user._id
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// NEW: Get basic course info (for locking screen)
router.get('/basic/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).select('title description price');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single course with lectures (Full details)
router.get('/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const lectures = await Lecture.find({ courseId: req.params.id });
        res.json({ course, lectures });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
