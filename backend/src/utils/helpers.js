import crypto from "crypto";
import bcrypt from "bcryptjs";

export function getUniqIdValue() {
  return crypto.randomUUID();
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
