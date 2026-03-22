const mongoose = require('mongoose');

// Schema for storing chatbot Q&A data
const KnowledgeBaseSchema = new mongoose.Schema({
    // Keywords the bot looks for in user questions
    keywords: [{ type: String, lowercase: true }],
    // Answer the bot gives when keywords match
    answer: { type: String, required: true },
    // Category of the question
    category: {
        type: String,
        enum: ['Fees', 'Hostel', 'Transport', 'General']
    },
});

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);