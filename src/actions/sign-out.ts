"use server";

import { cookies } from "next/headers";

/**
 * Server action to sign out the current user.
 *
 * Deletes the `sessionId` cookie, which instructs the browser to remove it
 * on the next response cycle.
 */
const signOutUser = async () => {
  const sessionCookie = await cookies();

  sessionCookie.delete("sessionId");
};

export default signOutUser;
