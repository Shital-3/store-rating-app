import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "../config/database.js";


/*
    NORMAL USER SIGNUP
*/
export const signup = async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            password,
            confirmPassword
        } = req.body;


        // -----------------------------
        // 1. Check required fields
        // -----------------------------

        if (
            !name ||
            !email ||
            !address ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "Please fill in all the required fields."
            });
        }


        // -----------------------------
        // 2. Validate name
        // -----------------------------

        if (name.length < 20 || name.length > 60) {

            return res.status(400).json({
                message: "Name should be between 20 and 60 characters long."
            });

        }


        // -----------------------------
        // 3. Validate address
        // -----------------------------

        if (address.length > 400) {

            return res.status(400).json({
                message: "Address cannot be longer than 400 characters."
            });

        }


        // -----------------------------
        // 4. Validate email
        // -----------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message: "Please enter a valid email address."
            });

        }


        // -----------------------------
        // 5. Validate password
        // -----------------------------

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                message:
                    "Password should be 8 to 16 characters long and include at least one uppercase letter and one special character."
            });

        }


        // -----------------------------
        // 6. Confirm password
        // -----------------------------

        if (password !== confirmPassword) {

            return res.status(400).json({
                message: "Passwords do not match. Please try again."
            });

        }


        // -----------------------------
        // 7. Check if email exists
        // -----------------------------

        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {

            return res.status(409).json({
                message: "This email is already registered. Please sign in instead."
            });

        }


        // -----------------------------
        // 8. Hash password
        // -----------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // -----------------------------
        // 9. Insert user
        // -----------------------------

        const [result] = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                address,
                "USER"
            ]
        );


        // -----------------------------
        // 10. Send response
        // -----------------------------

        return res.status(201).json({

            message: "User registered successfully",

            user: {
                id: result.insertId,
                name,
                email,
                address,
                role: "USER"
            }

        });


    } catch (error) {

        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


/*
    LOGIN
*/
export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // -----------------------------
        // 1. Required fields
        // -----------------------------

        if (!email || !password) {

            return res.status(400).json({
                message: "Please enter both email and password."
            });

        }


        // -----------------------------
        // 2. Find user
        // -----------------------------

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (users.length === 0) {

            return res.status(404).json({
                message: "No account found for this email. Please sign up first."
            });

        }


        const user = users[0];


        // -----------------------------
        // 3. Compare password
        // -----------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Incorrect password. Please try again."
            });

        }


        // -----------------------------
        // 4. Create JWT
        // -----------------------------

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // -----------------------------
        // 5. Send response
        // -----------------------------

        return res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }

        });


    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


/*
    UPDATE PASSWORD (User + Owner)
*/
export const updatePassword = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword,
            confirmNewPassword
        } = req.body;

        // -----------------------------
        // 1. Required fields
        // -----------------------------
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                message: "Please fill in your current password and new password fields."
            });
        }

        // -----------------------------
        // 2. New password format check
        //    (same rule as signup)
        // -----------------------------
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "New password should be 8 to 16 characters long and include at least one uppercase letter and one special character."
            });
        }

        // -----------------------------
        // 3. Confirm new password
        // -----------------------------
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: "New passwords do not match. Please try again."
            });
        }

        // -----------------------------
        // 4. Fetch current user
        // -----------------------------
        const [users] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

if (users.length === 0) {
            return res.status(404).json({
                message: "User not found. Please check your account details."
            });
        }

        const user = users[0];

        // -----------------------------
        // 5. Verify current password
        // -----------------------------
        const isCurrentPasswordCorrect =
            await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordCorrect) {
            return res.status(401).json({
                message: "Your current password is incorrect. Please try again."
            });
        }

        // -----------------------------
        // 6. Hash and update new password
        // -----------------------------
        const hashedNewPassword =
            await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedNewPassword, userId]
        );

        return res.status(200).json({
            message: "Your password has been updated successfully."
        });

    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};