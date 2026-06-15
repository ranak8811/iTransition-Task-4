import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = prismaClientPkg;

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// pool.query("Select Now()", (err, res) => {
//   if (err) {
//     console.error("Database connection failed: ", err.message);
//   } else {
//     console.log("Database connected successfully at: ", res.rows[0].now);
//   }
// });

export default prisma;
