import { getUserSessionData } from "@/repository/userSession";
import { cookies } from "next/headers";

export async function checkIfUserIsAuthenticated() {
  const sessionCookie = await cookies();
  const sessionId = sessionCookie.get("sessionId")?.value;

  if (!sessionId) return false;

  const sessionData = await getUserSessionData(sessionId);

  if (!sessionData) return false;

  // Reject expired sessions
  if (new Date(sessionData.expiresOn) < new Date()) return false;

  return true;
}
