// import "server-only";
"use server";

import { cookies } from "next/headers";
import { getUserSessionDataFromMongoDB } from "./mongodb";

export async function isUserAthenticated() {
  const sessionCookie = await cookies();
  const sessionId = sessionCookie.get("sessionId")?.value;

  if (!sessionId) return false;

  const sessionData = await getUserSessionDataFromMongoDB(sessionId);

  if (!sessionData) return false;

  // Reject expired sessions
  if (new Date(sessionData.expiresOn) < new Date()) return false;

  return true;
}
