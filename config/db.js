const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vlog_editor';

        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.warn(`⚠️ Local MongoDB daemon is not currently running (${error.message}).`);
        console.warn(`ℹ️ App is running in standalone mode (localStorage state active). Start MongoDB service to enable database persistence.`);
    }
};

// Handle connection events after initial connection
mongoose.connection.on('error', (err) => {
    console.error(`⚠️ MongoDB Runtime Connection Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
});

module.exports = connectDB;
