import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
        process.exit(1); // 1 is for failure, 0 is for success
    }
};