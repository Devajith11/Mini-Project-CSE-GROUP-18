const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        // Workaround for "querySrv ECONNREFUSED" on some Windows/Node versions
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/gecw_admission'
        );
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;