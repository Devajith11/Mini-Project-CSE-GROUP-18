const multer = require('multer');
const path = require('path');

// Use memory storage for Vercel serverless (no persistent disk)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|pdf/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        if (ext) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, PNG files are allowed'));
        }
    }
});

module.exports = upload;