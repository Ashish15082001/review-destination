"use server";

import { deleteUserSession } from "@/repository/userSession";
import { ApiResponse } from "@/types/apiResponse";
import { cookies } from "next/headers";

/**
 * Server action to sign out the current user.
 *
 * Deletes the `sessionId` cookie, which instructs the browser to remove it
 * on the next response cycle.
 */
export default async function signOutUser(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
  const clientCookies = await cookies();
  const sessionId = clientCookies.get("sessionId")?.value;

  if (sessionId) {
    await deleteUserSession(sessionId);

    clientCookies.delete("sessionId");
  }

  return {
    type: "success",
    message: "You have been signed out successfully.",
  };
}
