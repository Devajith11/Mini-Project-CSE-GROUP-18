const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

// Query chatbot
router.post('/query', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    const lowerQuery = query.toLowerCase();

    try {
        const knowledge = await KnowledgeBase.find();
        let bestMatch = null;

        for (const item of knowledge) {
            if (item.keywords.some(kw => lowerQuery.includes(kw))) {
                bestMatch = item;
                break;
            }
        }

        if (bestMatch) {
            res.json({ answer: bestMatch.answer });
        } else {
            res.json({
                answer: "I'm not sure about that. Please contact the college office at 04935-257321."
            });
        }
    } catch (err) {
        res.status(500).json({ message: 'Chatbot error' });
    }
});

// Seed Knowledge Base
router.post('/seed', async (req, res) => {
    try {
        const seedData = [
            {
                keywords: ['keam', 'admission', 'eligibility', 'documents', 'deadline'],
                answer: 'Admission & Eligibility:\n- Documents: Allotment Memo, Admit Card, TC, Conduct Certificate.\n- Eligibility: 45% in PCM for General, 40% for Reserved.\n- Contact admission cell for exact dates.',
                category: 'General'
            },
            {
                keywords: ['fee', 'fees', 'payment', 'cost', 'concession', 'sc', 'st'],
                answer: 'Fee Structure:\n- General/OBC: approx ₹34,600 total at admission.\n- SC/ST/OEC: Only Caution Deposit + PTA fund (approx ₹1,500-₹3,000).\n- Payment via online transfer.',
                category: 'Fees'
            },
            {
                keywords: ['department', 'branch', 'cse', 'ece', 'eee', 'mechanical', 'civil', 'seats'],
                answer: 'Departments & Intake:\n- CSE, ECE, EEE, ME, Civil Engineering.\n- 60 seats per branch + Lateral Entry.\n- Placement: TCS, Infosys and more.',
                category: 'General'
            },
            {
                keywords: ['hostel', 'accommodation', 'mess', 'transport', 'bus', 'location', 'wayanad'],
                answer: 'Campus & Hostel:\n- Location: Thalappuzha, 6km from Mananthavady.\n- Boys and Girls hostel available.\n- College bus routes from Mananthavady.',
                category: 'Hostel'
            },
            {
                keywords: ['contact', 'phone', 'office', 'help', 'support'],
                answer: 'Contact & Support:\n- Phone: 04935-257321\n- Office Hours: 9:30 AM to 4:30 PM.',
                category: 'General'
            }
        ];

        await KnowledgeBase.deleteMany({});
        await KnowledgeBase.insertMany(seedData);
        res.json({ message: 'Knowledge base seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

module.exports = router;