import bcrypt from "bcryptjs";
import pool from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        const name = "System Administrator";
        const email = "admin@gmail.com";
        const password = "Admin@123";
        const address = "Pune, Maharashtra";

        // Check if admin already exists
        const [existingAdmin] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
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
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await pool.end();
    }
};

createAdmin();