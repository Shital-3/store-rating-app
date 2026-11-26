import bcrypt from "bcryptjs";
import pool from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        const {
            ADMIN_NAME: name,
            ADMIN_EMAIL: configuredEmail,
            ADMIN_PASSWORD: password,
            ADMIN_ADDRESS: address
        } = process.env;

        if (!name || !configuredEmail || !password || !address) {
            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_ADDRESS must be configured."
            );
        }

        const email = configuredEmail.trim().toLowerCase();

        // Check if admin already exists
        const [existingAdmin] = await pool.query(
            "SELECT id FROM users WHERE LOWER(TRIM(email)) = ?",
            [email]
        );

        if (existingAdmin.length > 0) {
            console.log("Admin already exists");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin
        await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                address,
                "ADMIN"
            ]
        );

        console.log("Admin created successfully");

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createAdmin();