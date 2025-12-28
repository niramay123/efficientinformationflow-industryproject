import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("❌ MONGODB_URI is undefined in environment variables!");
            process.exit(1);
        }

        console.log(`Trying to connect to MongoDB... (URI length: ${uri.length})`);

        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB connected successfully: ${connection.connection.host}`);

        mongoose.connection.on('error', err => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error("❌ FATAL: MongoDB connection failed");
        console.error(error);
        // Do not exit process in development, just log
    }
}