import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  blockUsers,
  deleteUnverifiedUsers,
  deleteUsers,
  getUsers,
  unblockUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.put("/block", authenticateToken, blockUsers);
router.put("/unblock", authenticateToken, unblockUsers);

router.delete("/", authenticateToken, deleteUsers);
router.delete("/unverified", authenticateToken, deleteUnverifiedUsers);

export default router;
