import { getUserSessionData } from "@/repository/userSession";
import getCookieValue from "@/utils/getCookieValue";

export async function checkIfUserIsAuthenticated() {
  const sessionId = await getCookieValue("sessionId");

  if (!sessionId) return false;

  const sessionData = await getUserSessionData(sessionId);

  if (!sessionData) return false;

  // Reject expired sessions
  if (new Date(sessionData.expiresOn) < new Date()) return false;

  return true;
}
