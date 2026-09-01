import pool from "../config/database.js";
import bcrypt from "bcryptjs";




export const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId, rating } = req.body;

        // 1. Required fields
        if (!storeId || !rating) {
            return res.status(400).json({
                message: "Please select a store and give a rating first."
            });
        }

        // 2. Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });
        }

        // 3. Insert or update in one query
        await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = ?`,
            [userId, storeId, rating, rating]
        );

        return res.status(200).json({
            message: "Your rating has been submitted successfully."
        });

    } catch (error) {
        console.error("Submit rating error:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                message: "This store no longer exists. Please choose another one."
            });
        }

        return res.status(500).json({
            message: "Failed to submit rating"
        });
    }
};


export const getStoresForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address } = req.query;

        let sql = `
            SELECT
                s.id,
                s.name,
                s.address,
                ROUND(AVG(r.rating), 1) AS overall_rating,
                (
                    SELECT rating FROM ratings
                    WHERE store_id = s.id AND user_id = ?
                ) AS user_rating
            FROM stores s
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE 1 = 1
        `;

        const values = [userId];

        if (name || address) {
            const searchTerm = name || address;
            sql += ` AND (s.name LIKE ? OR s.address LIKE ?)`;
            values.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        sql += ` GROUP BY s.id`;

        const [stores] = await pool.query(sql, values);

        return res.status(200).json({ stores });

    } catch (error) {
        console.error("Get stores error:", error);
        return res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};