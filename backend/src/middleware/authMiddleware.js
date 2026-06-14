import jwt from "jsonwebtoken";
import prismaClientPkg from "@prisma/client";
import dotenv from "dotenv";
import prisma from "../config/db.js";

dotenv.config();

const { Prisma } = prismaClientPkg;

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token is missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: "USER_DELETED",
        message: "Your account has been deleted.",
      });
    }

    if (user.status === "blocked") {
      return res.status(401).json({
        status: "error",
        code: "USER_BLOCKED",
        message: "Your account is blocked.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token.",
    });
  }
};
