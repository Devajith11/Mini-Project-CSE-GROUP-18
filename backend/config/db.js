const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        // Workaround for "querySrv ECONNREFUSED" on local Windows dev only
        if (process.env.NODE_ENV !== 'production') {
            try {
                dns.setServers(['8.8.8.8', '8.8.4.4']);
            } catch (e) {
                console.warn('Custom DNS setServers skipped:', e.message);
            }
        }

        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/gecw_admission'
        );
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;