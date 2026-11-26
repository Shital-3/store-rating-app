import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

dotenv.config();

const app = express();
const defaultClientUrls =
    "http://localhost:5173,https://store-rating-app-rho-one.vercel.app";
const allowedOrigins = (process.env.CLIENT_URL || defaultClientUrls)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.includes(origin));
    }
}));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/", (req, res) => {
    res.json({
        message: "Store Rating API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/user", userRoutes);

app.use("/api/owner", ownerRoutes);


app.use("/api/account", accountRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const connection = await pool.getConnection();
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();