



import express from "express";

import { submitRating, getStoresForUser } from "../controllers/ratingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/ratings",
    authenticate,
    authorizeRoles("USER"),
    submitRating
);

router.get(
    "/stores",
    authenticate,
    authorizeRoles("USER"),
    getStoresForUser
);

export default router;