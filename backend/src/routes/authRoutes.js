import express from "express";

import {
    signup,
    login
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get(
    "/profile",
    authenticate,
    (req, res) => {

        res.json({
            message: "You are authenticated",
            user: req.user
        });

    }
);

router.get(
    "/admin-test",
    authenticate,
    authorizeRoles("ADMIN"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

export default router;