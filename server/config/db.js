const mongoose = require('mongoose');

let bucket;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Initialize GridFS bucket
        const db = conn.connection.db;
        bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'uploads'
        });
        console.log('GridFS Bucket Initialized');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const getBucket = () => {
    if (!bucket) {
        throw new Error('Bucket not initialized');
    }
    return bucket;
};

module.exports = { connectDB, getBucket };

