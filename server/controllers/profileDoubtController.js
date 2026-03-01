const ProfileDoubt = require('../models/ProfileDoubt');

const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const doubt = await ProfileDoubt.create({
            student: req.user._id,
            question
        });
        res.status(201).json(doubt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyDoubts = async (req, res) => {
    try {
        const doubts = await ProfileDoubt.find({ student: req.user._id }).sort('-createdAt');
        res.json(doubts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDoubts = async (req, res) => {
    try {
        const doubts = await ProfileDoubt.find().populate('student', 'name email').sort('-createdAt');
        res.json(doubts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resolveDoubt = async (req, res) => {
    try {
        const { answer } = req.body;
        const doubt = await ProfileDoubt.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        doubt.answer = answer;
        doubt.status = 'resolved';
        await doubt.save();
        res.json(doubt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { askQuestion, getMyDoubts, getAllDoubts, resolveDoubt };
