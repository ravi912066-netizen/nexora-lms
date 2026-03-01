const mongoose = require('mongoose');

const LiveRoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isLive: { type: Boolean, default: false },
    scheduledTime: { type: Date },
    currentQuestion: {
        title: { type: String },
        problemUrl: { type: String },
        xp: { type: Number, default: 100 }
    },
    activeStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('LiveRoom', LiveRoomSchema);
