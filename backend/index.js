const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5001;

// ── MIDDLEWARE ──
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// ── ROUTES ──
app.get('/', (req, res) => {
    res.send('🎓 GECW Admission Management System API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// ── START SERVER ──
const startServer = async () => {
    try {
        await connectDB();

        // Create default admin on startup
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.findOneAndUpdate(
            { username: 'admin_gecw' },
            {
                password: hashedPassword,
                role: 'Admission Clerk',
                branch: 'All'
            },
            { upsert: true, new: true }
        );
        console.log('✅ Default Admin "admin_gecw" ready (Password: admin123)');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
};

startServer();