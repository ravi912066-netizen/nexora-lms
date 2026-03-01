const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    paymentScreenshot: { type: String }, // URL to uploaded screenshot
    transactionId: { type: String },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
