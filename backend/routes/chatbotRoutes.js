const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

// ── QUERY ROUTE ──
// POST /api/chatbot/query
// Student sends a message → bot finds best matching answer
router.post('/query', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    const lowerQuery = query.toLowerCase();

    try {
        // Get all Q&A from database
        const knowledge = await KnowledgeBase.find();
        let bestMatch = null;

        // Check which keywords match the user's question
        for (const item of knowledge) {
            if (item.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lowerQuery))) {
                bestMatch = item;
                break;
            }
        }

        if (bestMatch) {
            res.json({ answer: bestMatch.answer });
        } else {
            // Default response if no match found
            res.json({
                answer: "I'm not sure about that. Please contact the college office at 04935-257321 for more info."
            });
        }
    } catch (err) {
        res.status(500).json({ message: 'Chatbot error' });
    }
});

// ── SEED ROUTE ──
// POST /api/chatbot/seed
// Loads all FAQ data into the database
router.post('/seed', async (req, res) => {
    try {
        const seedData = [
            {
                keywords: ['keam', 'admission', 'eligibility', 'documents', 'deadline', 'allotment'],
                answer: 'Admission & Eligibility:\n- Documents Required: Allotment Memo, Admit Card, TC, Conduct Certificate, Physical Fitness Certificate.\n- Eligibility: 45% in PCM for General, 40% for Reserved category.\n- Contact admission cell for exact reporting dates.',
                category: 'General'
            },
            {
                keywords: ['fee', 'fees', 'payment', 'cost', 'concession', 'obc', 'oec', 'tuition'],
                answer: 'Fee Structure:\n- General/OBC: approx ₹34,600 total at admission 2026.\n- SC/ST/OEC: Only Caution Deposit + PTA fund (approx ₹1,500 - ₹3,000).\n- Payment via online transfer through the portal.',
                category: 'Fees'
            },
            {
                keywords: ['course', 'courses', 'department', 'departments', 'branch', 'branches', 'cse', 'ece', 'eee', 'mechanical', 'me', 'civil', 'ce', 'seats', 'intake'],
                answer: 'Departments & Intake:\n- Branches: CSE, ECE, EEE, ME, Civil Engineering.\n- 60 seats per branch + Lateral Entry seats.\n- Recent recruiters: TCS, Infosys and more.',
                category: 'General'
            },
            {
                keywords: ['hostel', 'accommodation', 'mh', 'lh', 'mess', 'transport', 'bus', 'location', 'wayanad'],
                answer: 'Campus & Hostel:\n- Location: Thalappuzha, 6km from Mananthavady.\n- Boys Hostel (MH) and Girls Hostel (LH) available.\n- Monthly mess charges and rent apply.\n- College bus routes from Mananthavady.',
                category: 'Hostel'
            },
            {
                keywords: ['contact', 'phone', 'office', 'help', 'support', 'number', 'call'],
                answer: 'Contact & Support:\n- Phone: 04935-257321\n- Email: principal@gecwyd.ac.in\n- Office Hours: 9:30 AM to 4:30 PM.',
                category: 'General'
            },
            {
                keywords: ['scholarship', 'merit', 'award', 'financial'],
                answer: 'Scholarships:\n- SC/ST students get full fee waiver.\n- Merit scholarships available for top performers.\n- Contact the office for more details.',
                category: 'General'
            },
            {
                keywords: ['wifi', 'internet', 'campus', 'facilities', 'lab', 'library'],
                answer: 'Campus Facilities:\n- WiFi enabled campus.\n- Modern computer labs.\n- Central library with digital resources.\n- Sports facilities available.',
                category: 'General'
            },
            {
                keywords: ['lateral', 'diploma', 'second year', 'direct'],
                answer: 'Lateral Entry:\n- Available for diploma holders.\n- Direct admission to second year.\n- Contact admission cell for eligibility details.',
                category: 'General'
            }
        ];

        // Clear old data and insert fresh data
        await KnowledgeBase.deleteMany({});
        await KnowledgeBase.insertMany(seedData);
        res.json({ message: 'Knowledge base seeded successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

// ── ADD NEW INTENT ROUTE ──
// POST /api/chatbot/add
// Add a new Q&A without clearing existing data
router.post('/add', async (req, res) => {
    const { keywords, answer, category } = req.body;
    try {
        const newIntent = new KnowledgeBase({ keywords, answer, category });
        await newIntent.save();
        res.json({ message: 'Intent added successfully!', newIntent });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add intent' });
    }
});

// ── GET ALL INTENTS ──
// GET /api/chatbot/all
// View all Q&A stored in database
router.get('/all', async (req, res) => {
    try {
        const all = await KnowledgeBase.find();
        res.json(all);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch intents' });
    }
});

module.exports = router;