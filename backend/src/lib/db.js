import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Đã kết nối với MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log("Lỗi khi kết nối với MongoDB", error);
        process.exit(1); // 1 is for failure, 0 is for success
    }
};