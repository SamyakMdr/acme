const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) return mongoose.connection;

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is not set');

    await mongoose.connect(mongoUri, {
        maxPoolSize: 10
    });

    isConnected = true;
    return mongoose.connection;
}

module.exports = { connectToDatabase };

