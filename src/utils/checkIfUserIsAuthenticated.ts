import { getUserSessionData } from "@/repository/userSession";
import getCookie from "@/utils/getCookie";

export async function checkIfUserIsAuthenticated() {
  const sessionId = await getCookie("sessionId");

  if (!sessionId) return false;

  const sessionData = await getUserSessionData(sessionId);

  if (!sessionData) return false;

  // Reject expired sessions
  if (new Date(sessionData.expiresOn) < new Date()) return false;

  return true;
}
