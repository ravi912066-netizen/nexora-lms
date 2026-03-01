const mongoose = require('mongoose');

const ProfileDoubtSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    answer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ProfileDoubt', ProfileDoubtSchema);
