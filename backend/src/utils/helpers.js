import crypto from "crypto";

export function getUniqIdValue() {
  return crypto.randomUUID();
}
