import express from "express";

import { updatePassword } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.put(
    "/password",
    authenticate,
    authorizeRoles("USER", "OWNER"),
    updatePassword
);

export default router;