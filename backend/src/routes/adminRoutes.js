import express from "express";

import {
    getDashboardStats,
    createUser,
    getAllUsers,
    getUserById,      // add this
    getAllStores,
    createStore
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorizeRoles("ADMIN"),
    getDashboardStats
);

router.post(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    createUser
);

router.get(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    getAllUsers
);

router.post(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    createStore
);

router.get(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    getAllStores
);

router.get(
    "/users/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    getUserById
);

export default router;


