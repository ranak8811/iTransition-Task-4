import prisma from "../config/db.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { getUniqIdValue, hashPassword } from "../utils/helpers.js";
import prismaClientPkg from "@prisma/client";
const { Prisma } = prismaClientPkg;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required.",
    });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const verificationToken = getUniqIdValue();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: "unverified",
        verificationToken,
      },

      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      status: "success",
      message: "Registration successful! Verification link sent to email.",
      user,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          status: "error",
          message: "Email already exists.",
        });
      }
    }

    console.error("Register Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Verification token is missing");
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: user.status === "blocked" ? "blocked" : "active",
        verificationToken: null,
      },
    });

    return res.redirect("http://localhost:5173/login?verified=true");
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).send("Internal server error during verification.");
  }
};
