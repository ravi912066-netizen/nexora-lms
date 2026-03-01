const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const LiveRoom = require('../models/LiveRoom');
const Assignment = require('../models/Assignment');

// Start or Schedule a live room
router.post('/start', protect, admin, async (req, res) => {
    const { courseId, roomId, scheduledTime } = req.body;
    try {
        // Find if a room already exists for this course
        let room = await LiveRoom.findOne({ courseId, instructor: req.user._id });

        if (room) {
            room.roomId = roomId || room.roomId;
            room.scheduledTime = scheduledTime || room.scheduledTime;
            room.isLive = roomId ? true : room.isLive; // If roomId is sent, we assume it's going live
            await room.save();
        } else {
            room = await LiveRoom.create({
                roomId: roomId || `room-${Date.now()}`,
                instructor: req.user._id,
                courseId,
                scheduledTime,
                isLive: !!roomId
            });
        }
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get scheduled class for a course
router.get('/scheduled/:courseId', protect, async (req, res) => {
    try {
        const room = await LiveRoom.findOne({ courseId: req.params.courseId, isLive: false, scheduledTime: { $exists: true } });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Push a question to the live room
router.post('/push', protect, admin, async (req, res) => {
    const { roomId, title, problemUrl, xp } = req.body;
    try {
        const room = await LiveRoom.findOne({ roomId, isLive: true });
        if (!room) return res.status(404).json({ message: 'Live room not found' });

        room.currentQuestion = { title, problemUrl, xp };
        await room.save();
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current live room for a course
router.get('/room/:courseId', protect, async (req, res) => {
    try {
        const room = await LiveRoom.findOne({ courseId: req.params.courseId, isLive: true }).populate('activeStudents', 'name email');
        if (!room) return res.status(404).json({ message: 'No live class right now' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Join live room (recording active student)
router.post('/join', protect, async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await LiveRoom.findOne({ roomId, isLive: true });
        if (room && !room.activeStudents.includes(req.user._id)) {
            room.activeStudents.push(req.user._id);
            await room.save();
        }
        res.json({ message: 'Joined' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// End class & convert question to permanent assignment
router.post('/end', protect, admin, async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await LiveRoom.findOne({ roomId, isLive: true });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.currentQuestion && room.currentQuestion.title) {
            await Assignment.create({
                courseId: room.courseId,
                title: `${room.currentQuestion.title} (Live Class)`,
                description: 'This was assigned during a live session.',
                problemUrl: room.currentQuestion.problemUrl,
                xp: room.currentQuestion.xp,
                type: 'assignment'
            });
        }

        room.isLive = false;
        await room.save();
        res.json({ message: 'Class ended and assignment saved.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
