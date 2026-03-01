const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    lecturesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    assignmentsCompleted: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Performance', PerformanceSchema);
