const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Simulation of External Handle Verification
const verifyHandleOnPlatform = async (platform, handle) => {
    // In a real app, we would use axios to check:
    // CF: https://codeforces.com/api/user.info?handles=handle
    // LC: https://leetcode-stats-api.herokuapp.com/handle
    // GFG: Scraping or API

    // Simulation: Any handle longer than 3 chars is "verified" for this demo
    return handle && handle.length > 3;
};

const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const isApproved = role === 'admin' ? true : false;
        const user = await User.create({ name, email, password, role, isApproved, phone });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isApproved: user.isApproved,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (!user.isApproved) {
                return res.status(403).json({ message: 'Aapka account abhi approve nahi hua hai. Ravi Yadav bhai ko bolo approve karne ke liye!' });
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otpCode;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            await user.save();

            console.log('--- OTP SIMULATION ---');
            console.log(`To: ${user.email} & ${user.phone}`);
            console.log(`OTP Code: ${otpCode}`);
            console.log('----------------------');

            return res.json({
                requireOtp: true,
                email: user.email,
                message: 'OTP bhej diya gaya hai (check console)!'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Galat ya expired OTP hai.' });
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profilePicture: user.profilePicture,
            location: user.location,
            codeforcesHandle: user.codeforcesHandle,
            leetcodeHandle: user.leetcodeHandle,
            gfgHandle: user.gfgHandle,
            isVerifiedCF: user.isVerifiedCF,
            isVerifiedLC: user.isVerifiedLC,
            isVerifiedGFG: user.isVerifiedGFG,
            upiId: user.upiId,
            paymentInstructions: user.paymentInstructions,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        user.upiId = req.body.upiId || user.upiId;
        user.paymentInstructions = req.body.paymentInstructions || user.paymentInstructions;

        // Handle Codeforces Verification
        if (req.body.codeforcesHandle && req.body.codeforcesHandle !== user.codeforcesHandle) {
            user.codeforcesHandle = req.body.codeforcesHandle;
            user.isVerifiedCF = await verifyHandleOnPlatform('CF', req.body.codeforcesHandle);
        }

        // Handle LeetCode Verification
        if (req.body.leetcodeHandle && req.body.leetcodeHandle !== user.leetcodeHandle) {
            user.leetcodeHandle = req.body.leetcodeHandle;
            user.isVerifiedLC = await verifyHandleOnPlatform('LC', req.body.leetcodeHandle);
        }

        // Handle GFG Verification
        if (req.body.gfgHandle && req.body.gfgHandle !== user.gfgHandle) {
            user.gfgHandle = req.body.gfgHandle;
            user.isVerifiedGFG = await verifyHandleOnPlatform('GFG', req.body.gfgHandle);
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            location: updatedUser.location,
            codeforcesHandle: updatedUser.codeforcesHandle,
            leetcodeHandle: updatedUser.leetcodeHandle,
            gfgHandle: updatedUser.gfgHandle,
            isVerifiedCF: updatedUser.isVerifiedCF,
            isVerifiedLC: updatedUser.isVerifiedLC,
            isVerifiedGFG: updatedUser.isVerifiedGFG,
            upiId: updatedUser.upiId,
            paymentInstructions: updatedUser.paymentInstructions,
            profilePicture: updatedUser.profilePicture,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isApproved = true;
        await user.save();
        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const initiateCall = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const roomId = `1on1-${req.user._id}-${student._id}-${Date.now()}`;
        student.activeCallRoom = roomId;
        await student.save();

        res.json({ message: 'Call initiated', roomId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const endCall = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.activeCallRoom = undefined;
        await student.save();

        res.json({ message: 'Call ended' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, approveUser, verifyOtp, updateProfile, initiateCall, endCall };
