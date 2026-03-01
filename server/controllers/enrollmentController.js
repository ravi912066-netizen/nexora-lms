const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Student: Request Enrollment (Upload Screenshot)
const requestEnrollment = async (req, res) => {
    try {
        const { courseId, transactionId } = req.body;
        const studentId = req.user._id;

        // Check if already enrolled or pending
        const existing = await Enrollment.findOne({ student: studentId, course: courseId });
        if (existing) {
            return res.status(400).json({ message: 'Request already exists or you are already enrolled.' });
        }

        let paymentScreenshot = '';
        if (req.file) {
            paymentScreenshot = `/uploads/${req.file.filename}`;
        }

        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            transactionId,
            paymentScreenshot
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all pending enrollments
const getPendingEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ status: 'pending' })
            .populate('student', 'name email phone')
            .populate('course', 'title price');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Approve/Reject Enrollment
const updateEnrollmentStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        enrollment.status = status;
        if (status === 'approved') {
            enrollment.approvedAt = new Date();
        }
        await enrollment.save();

        res.json({ message: `Enrollment ${status}`, enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Enrollments (Student)
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate('course', 'title price'); // Changed populate fields here
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPaymentInfo = async (req, res) => {
    try {
        // Find the first admin who has a UPI ID set
        const admin = await User.findOne({ role: 'admin', upiId: { $ne: null } });
        if (!admin) {
            return res.json({ upiId: 'raviyadav@upi', paymentInstructions: 'Please contact support for payment.' });
        }
        res.json({ upiId: admin.upiId, paymentInstructions: admin.paymentInstructions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    requestEnrollment,
    getPendingEnrollments,
    updateEnrollmentStatus,
    getMyEnrollments,
    getPaymentInfo
};
