import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import {initializeSocket} from "./lib/socket.js";


import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";


dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT

const httpServer = createServer(app);
initializeSocket(httpServer)

app.use(cors(
    {
        origin: "http://localhost:3000", // cho phép frontend truy cập
        credentials: true
    }));

app.use(express.json()); // để phân tích req.body

app.use(clerkMiddleware()); // điều này sẽ thêm auth vào đối tượng req => req.auth.userId

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { 
        fileSize: 10 * 1024 * 1024, }, // 10MB max file size
}))

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// Bộ xử lý lỗi
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "sản xuất" ? "Lỗi máy chủ nội bộ" : err.message });
});

httpServer.listen(PORT, () => {
    console.log("Máy chủ đang chạy trên PORT " + PORT);
    connectDB();
});
