const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String }, // Added for OTP
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isApproved: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    profilePicture: { type: String },
    location: { type: String },
    codeforcesHandle: { type: String },
    leetcodeHandle: { type: String },
    gfgHandle: { type: String },
    isVerifiedCF: { type: Boolean, default: false },
    isVerifiedLC: { type: Boolean, default: false },
    isVerifiedGFG: { type: Boolean, default: false },
    upiId: { type: String }, // For Admin to receive payments
    paymentInstructions: { type: String } // For Admin to guide students
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
