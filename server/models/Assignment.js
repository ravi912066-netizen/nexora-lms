const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    xp: { type: Number, required: true, default: 100 },
    problemUrl: { type: String },
    documentUrl: { type: String },
    type: { type: String, enum: ['assignment', 'quiz'], default: 'assignment' },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
