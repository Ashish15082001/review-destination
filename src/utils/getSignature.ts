import crypto from "crypto";

export default function getSignature(value: string): string {
  return crypto
    .createHmac("sha256", process.env.COOKIE_SECRET_KEY || "")
    .update(value)
    .digest("hex");
}
