const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { adminAuth } = require('../middleware/auth');

// Get All Students
router.get('/students', adminAuth, async (req, res) => {
    try {
        let query = {};
        const adminBranch = req.user.branch;
        if (adminBranch && adminBranch !== 'All') {
            query.branch = adminBranch;
        }
        const students = await Student.find(query).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Verify Document
router.post('/verify', adminAuth, async (req, res) => {
    const { studentId, documentId, status, adminFeedback } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const doc = student.documents.id(documentId);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        doc.status = status;
        if (adminFeedback) doc.adminFeedback = adminFeedback;
        await student.save();
        res.json({ message: `Document ${status}`, student });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Student Status
router.post('/update-status', adminAuth, async (req, res) => {
    const { studentId, status } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { status },
            { new: true }
        ).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Send Remarks to Student
router.post('/update-remarks', adminAuth, async (req, res) => {
    const { studentId, adminRemarks } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { adminRemarks },
            { new: true }
        ).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;