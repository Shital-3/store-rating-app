import pool from "../config/database.js";
import bcrypt from "bcryptjs";

export const getDashboardStats = async (req, res) => {
    try {

        // Count total users
        const [userResult] = await pool.query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        // Count total stores
        const [storeResult] = await pool.query(
            "SELECT COUNT(*) AS totalStores FROM stores"
        );

        // Count total ratings
        const [ratingResult] = await pool.query(
            "SELECT COUNT(*) AS totalRatings FROM ratings"
        );

        return res.status(200).json({
            totalUsers: userResult[0].totalUsers,
            totalStores: storeResult[0].totalStores,
            totalRatings: ratingResult[0].totalRatings
        });

    } catch (error) {

        console.error("Dashboard error:", error);

        return res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });

    }
};


export const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        // Check required fields
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "Please fill in all the required fields."
            });
        }

        // Validate role is one of the allowed values
        const allowedRoles = ["ADMIN", "USER", "OWNER"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Please choose a valid role for this user."
            });
        }

        // Check whether email already exists
        const [existingUser] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "This email is already registered. Please use a different one."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [result] = await pool.query(
            `INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        return res.status(201).json({
            message: "User added successfully.",
            userId: result.insertId
        });

    } catch (error) {

        console.error("Create user error:", error);

        return res.status(500).json({
            message: "Failed to create user"
        });
    }
};

export const getAllStores = async (req, res) => {
    try {

        const {
            name,
            email,
            address,
            sortBy,
            order
        } = req.query;

        let sql = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS overallRating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
        `;

        const values = [];
        const conditions = [];

        // Search by store name
        if (name) {
            conditions.push(`s.name LIKE ?`);
            values.push(`%${name}%`);
        }

        // Search by email
        if (email) {
            conditions.push(`s.email LIKE ?`);
            values.push(`%${email}%`);
        }

        // Search by address
        if (address) {
            conditions.push(`s.address LIKE ?`);
            values.push(`%${address}%`);
        }

        // Add WHERE only when conditions exist
        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(" AND ");
        }

        sql += `
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id
        `;

        // Allowed sorting fields
        const allowedSortFields = {
            id: "s.id",
            name: "s.name",
            email: "s.email",
            address: "s.address",
            overallRating: "overallRating"
        };

        const sortColumn =
            allowedSortFields[sortBy] || "s.id";

        const sortOrder =
            order?.toLowerCase() === "asc"
                ? "ASC"
                : "DESC";

        sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const [stores] = await pool.query(sql, values);

        return res.status(200).json({
            stores
        });

    } catch (error) {

        console.error("Get stores error:", error);

        return res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {

        const {
            name,
            email,
            address,
            role,
            sortBy,
            order
        } = req.query;

        let sql = `
            SELECT id, name, email, address, role
            FROM users
            WHERE 1 = 1
        `;

        const values = [];

        // Search by name
        if (name) {
            sql += ` AND name LIKE ?`;
            values.push(`%${name}%`);
        }

        // Search by email
        if (email) {
            sql += ` AND email LIKE ?`;
            values.push(`%${email}%`);
        }

        // Search by address
        if (address) {
            sql += ` AND address LIKE ?`;
            values.push(`%${address}%`);
        }

        // Filter by role
        if (role) {
            sql += ` AND role = ?`;
            values.push(role);
        }

        // Allowed sorting fields
        const allowedSortFields = {
            id: "id",
            name: "name",
            email: "email",
            address: "address",
            role: "role"
        };

        const sortColumn =
            allowedSortFields[sortBy] || "id";

        const sortOrder =
            order?.toLowerCase() === "asc"
                ? "ASC"
                : "DESC";

        sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const [users] = await pool.query(sql, values);

        return res.status(200).json({
            users
        });

    } catch (error) {

        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

export const createStore = async (req, res) => {
    try {

        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        // Check required fields
        if (!name || !email || !address) {
            return res.status(400).json({
                message: "Please fill in the store name, email, and address."
            });
        }

        // Check if store email already exists
        const [existingStore] = await pool.query(
            "SELECT id FROM stores WHERE email = ?",
            [email]
        );

        if (existingStore.length > 0) {
            return res.status(409).json({
                message: "This store email is already in use. Please use another one."
            });
        }

        // Insert store
        const [result] = await pool.query(
            `INSERT INTO stores
            (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                address,
                owner_id || null
            ]
        );

        return res.status(201).json({
            message: "Store added successfully.",
            storeId: result.insertId
        });

    } catch (error) {

        console.error("Create store error:", error);

        return res.status(500).json({
            message: "Failed to create store"
        });
    }
};



export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const [users] = await pool.query(
            "SELECT id, name, email, address, role FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        // If Store Owner, attach their store's average rating
        if (user.role === "OWNER") {

            const [stores] = await pool.query(
                "SELECT id FROM stores WHERE owner_id = ?",
                [id]
            );

            if (stores.length > 0) {

                const storeId = stores[0].id;

                const [ratingResult] = await pool.query(
                    `SELECT ROUND(AVG(rating), 1) AS average_rating
                     FROM ratings
                     WHERE store_id = ?`,
                    [storeId]
                );

                user.rating = ratingResult[0].average_rating;

            } else {
                user.rating = null;
            }
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error("Get user by id error:", error);
        return res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};