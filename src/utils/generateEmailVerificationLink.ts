export default function generateEmailVerificationLink(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
}
