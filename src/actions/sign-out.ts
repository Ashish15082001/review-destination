"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const signOutUser = async () => {
  const sessionCookie = await cookies();

  sessionCookie.delete("sessionId");

  revalidatePath("/"); // Revalidate the home page to reflect the sign-out state
};

export default signOutUser;
