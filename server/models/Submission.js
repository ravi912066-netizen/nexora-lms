const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    score: { type: Number, default: 0 },
    url: { type: String, required: false },
    code: { type: String, required: false },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    submittedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
