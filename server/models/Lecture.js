const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true } // Duration in minutes
}, { timestamps: true });

module.exports = mongoose.model('Lecture', LectureSchema);
