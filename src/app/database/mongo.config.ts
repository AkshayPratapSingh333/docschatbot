import mongoose from 'mongoose'

let isConnected = false;

export const connect = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not defined in environment variables');
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            tls: true,
            dbName: "docChatDB"
        });
        
        isConnected = true;
        console.log("Database Connected Successfully!");
    } catch (error) {
        isConnected = false;
        console.error("Database connection error:", error);
        throw error; // Re-throw to be handled by the caller
    }
}