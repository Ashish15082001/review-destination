"use server";

import { cookies } from "next/headers";

export async function isUserAthenticated() {
  //  return if user is authenticated or not
  const sessionData = (await cookies()).get("sessionId");

  console.log(sessionData);

  return sessionData ? true : false;
}
