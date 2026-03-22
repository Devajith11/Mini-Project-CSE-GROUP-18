const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Student Register
router.post('/register', async (req, res) => {
    const { keamAppNumber, password } = req.body;
    try {
        const existing = await Student.findOne({ keamAppNumber });
        if (existing) {
            return res.status(400).json({ message: 'Already registered account, you can sign in' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({ keamAppNumber, password: hashedPassword });
        await student.save();
        const token = jwt.sign(
            { id: student._id, role: 'student' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );
        res.json({ token, student });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Student Login
router.post('/login', async (req, res) => {
    const { keamAppNumber, password } = req.body;
    try {
        const student = await Student.findOne({ keamAppNumber });
        if (!student) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Password.' });
        }
        const token = jwt.sign(
            { id: student._id, role: 'student' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );
        res.json({ token, student });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Student Password Reset
router.post('/reset-password', async (req, res) => {
    const { keamAppNumber, newPassword } = req.body;
    try {
        const student = await Student.findOne({ keamAppNumber });
        if (!student) {
            return res.status(400).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        await student.save();
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Password Reset Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Password.' });
        }
        const token = jwt.sign(
            {
                id: admin._id,
                role: 'admin',
                adminRole: admin.role,
                branch: admin.branch
            },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );
        res.json({
            token,
            admin: {
                username: admin.username,
                role: admin.role,
                branch: admin.branch
            }
        });
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;