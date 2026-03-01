require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
    res.send('Nexora API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes'); // Added enrollment routes
const liveRoutes = require('./routes/liveRoutes');
const profileDoubtRoutes = require('./routes/profileDoubtRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/enrollments', enrollmentRoutes); // Register enrollment routes
app.use('/api/live', liveRoutes);
app.use('/api/doubts', profileDoubtRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
