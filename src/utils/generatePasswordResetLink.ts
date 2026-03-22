export default function generatePasswordResetLink(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
}
