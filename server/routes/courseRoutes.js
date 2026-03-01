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
    const { title, description } = req.body;
    try {
        const course = await Course.create({ title, description, instructor: req.user._id });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single course with lectures
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
