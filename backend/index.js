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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
    console.log(`📨 SERVER_HIT: ${req.method} ${req.originalUrl}`);
    next();
});

// ── DB CONNECTION (cached for serverless) ──
let dbConnected = false;
const ensureDB = async () => {
    if (!dbConnected) {
        await connectDB();
        dbConnected = true;
    }
};

// ── DEFAULT ADMIN SETUP (cached for serverless) ──
let adminCreated = false;
const ensureAdmin = async () => {
    if (!adminCreated) {
        const adminExists = await Admin.findOne({ username: 'admin_gecw' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                username: 'admin_gecw',
                password: hashedPassword,
                role: 'Admission Clerk',
                branch: 'All'
            });
            console.log('✅ Default Admin "admin_gecw" created.');
        } else {
            console.log('✅ Default Admin "admin_gecw" already exists.');
        }
        adminCreated = true;
    }
};

// Middleware to ensure DB + admin on every request (serverless-safe)
app.use(async (req, res, next) => {
    try {
        await ensureDB();
        await ensureAdmin();
        next();
    } catch (err) {
        console.error('❌ Startup middleware error:', err);
        res.status(500).json({ message: 'Server initialization failed' });
    }
});

// ── ROUTES ──
app.get('/', (req, res) => {
    res.json({ message: '🎓 GECW Admission Management System API is running...' });
});

// Explicitly register API roots
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Catch-all for API 404
app.use('/api', (req, res) => {
    console.log(`❌ API_NOT_FOUND: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 UNHANDLED_ERROR:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ── START SERVER (local dev only) ──
if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        try {
            await ensureDB();
            await ensureAdmin();

            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
                console.log(`📡 API: http://localhost:${PORT}/api`);
            });
        } catch (err) {
            console.error('❌ Failed to start server:', err);
            process.exit(1);
        }
    };

    startServer();
}

// Export for Vercel serverless
module.exports = app;