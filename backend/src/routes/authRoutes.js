import express from "express";
import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify", verifyEmail);
router.post("/login", loginUser);

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    status: "success",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      status: req.user.status,
    },
  });
});

export default router;
