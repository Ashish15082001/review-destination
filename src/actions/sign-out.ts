"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const signOutUser = async () => {
  const sessionCookie = await cookies();

  sessionCookie.delete("sessionId");
  redirect("/");
};

export default signOutUser;
