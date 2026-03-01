const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding.');

        // Remove existing users matching these emails to avoid duplication
        await User.deleteMany({ email: { $in: ['ravi912066@gmail.com', 'nandiniyadaventer05@gmail.com'] } });

        const adminUser = new User({
            name: 'Ravi Yadav',
            email: 'ravi912066@gmail.com',
            password: 'ravi@123',
            role: 'admin'
        });

        const studentUser = new User({
            name: 'Nandini Yadav',
            email: 'nandiniyadaventer05@gmail.com',
            password: 'Nandini@123',
            role: 'student'
        });

        await adminUser.save();
        console.log('Admin user (Ravi Yadav) created successfully.');

        await studentUser.save();
        console.log('Student user (Nandini Yadav) created successfully.');

        process.exit(0);
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
