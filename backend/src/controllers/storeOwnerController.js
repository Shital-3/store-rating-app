import pool from "../config/database.js";


export const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // 1. Find the store belonging to this owner
        const [stores] = await pool.query(
            `SELECT id, name, address FROM stores WHERE owner_id = ?`,
            [ownerId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "No store is assigned to this owner yet. Please contact the admin."
            });
        }

        const store = stores[0];

        // 2. Get average rating for that store
        const [ratingResult] = await pool.query(
            `SELECT ROUND(AVG(rating), 1) AS average_rating
             FROM ratings
             WHERE store_id = ?`,
            [store.id]
        );

        const averageRating = ratingResult[0].average_rating;

        // 3. Get list of users who rated this store, including timestamp
        const [raters] = await pool.query(
            `SELECT u.id, u.name, u.email, r.rating, r.created_at AS rated_at
             FROM ratings r
             JOIN users u ON u.id = r.user_id
             WHERE r.store_id = ?
             ORDER BY r.created_at DESC`,
            [store.id]
        );

        return res.status(200).json({
            store: {
                id: store.id,
                name: store.name,
                address: store.address
            },
            averageRating: averageRating,
            raters: raters
        });

    } catch (error) {
        console.error("Owner dashboard error:", error);
        return res.status(500).json({
            message: "Failed to fetch dashboard"
        });
    }
};