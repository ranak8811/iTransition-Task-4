import express from "express";
import cors from "cors";
import pool from "./src/config/db.js";
import { getUniqIdValue } from "./src/utils/helpers.js";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.CLIENT_URL,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// app.get("/api/test-connection", async (req, res) => {
//   try {
//     const dbTest = await pool.query("Select Now()");
//     const testToken = getUniqIdValue();

//     res.json({
//       status: "success",
//       message: "Database and Backend are fully linked!",
//       timestamp: dbTest.rows[0].now,
//       generatedToken: testToken,
//     });
//   } catch (error) {
//     console.error("Test connection route error: ", error);
//     res.status(500).json({
//       status: "error",
//       message: "Database connection failed during test.",
//       error: error.message,
//     });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
