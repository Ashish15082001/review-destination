"use server";

import { cookies } from "next/headers";

export async function isUserAthenticated() {
  //  return if user is authenticated or not
  const sessionId = (await cookies()).get("session-id");

  return sessionId ? true : false;
}
