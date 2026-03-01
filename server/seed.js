const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => { console.error(err); process.exit(1); });

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, default: 'student' },
    isApproved: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    profilePicture: String,
    location: String,
    codeforcesHandle: String,
    leetcodeHandle: String,
    gfgHandle: String,
    upiId: String,
    paymentInstructions: String,
    activeCallRoom: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function resetPasswords() {
    const accounts = [
        {
            email: 'ravi912066@gmail.com',
            password: 'ravi@123',
            name: 'Ravi Yadav',
            role: 'admin',
            isApproved: true,
            phone: '9120660000',
            location: 'Lucknow, UP',
            codeforcesHandle: 'ravi912066',
            leetcodeHandle: 'ravi912066',
            upiId: 'ravi912066@paytm',
            paymentInstructions: 'Pay via UPI to ravi912066@paytm and upload screenshot below.',
        },
        {
            email: 'nandiniyadaventer05@gmail.com',
            password: 'Nandini@123',
            name: 'Nandini Yadav',
            role: 'student',
            isApproved: true,
            phone: '9140050000',
        },
        {
            email: 'test@example.com',
            password: 'nexora123',
            name: 'Test Student',
            role: 'student',
            isApproved: true,
        },
    ];

    for (const account of accounts) {
        const hashed = await bcrypt.hash(account.password, 10);
        await User.findOneAndUpdate(
            { email: account.email },
            { ...account, password: hashed },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`✅ ${account.email} — password set to "${account.password}"`);
    }

    console.log('\n🎉 All accounts set up correctly!');
    console.log('\n📋 Login Credentials:');
    console.log('  Admin → ravi912066@gmail.com / ravi@123');
    console.log('  Student → nandiniyadaventer05@gmail.com / Nandini@123');
    console.log('  Test → test@example.com / nexora123');
    process.exit(0);
}

resetPasswords().catch(err => {
    console.error(err);
    process.exit(1);
});
