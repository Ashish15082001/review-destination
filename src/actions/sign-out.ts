"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";

const signOutUser = async () => {
  const sessionCookie = await cookies();
  const sessionData = sessionCookie.get("sessionId");
  console.log("sessionData before delete = ", sessionData);

  sessionCookie.delete("sessionId");

  const sessionDataAfterDelete = sessionCookie.get("sessionId");
  console.log("sessionData after delete = ", sessionDataAfterDelete);
  refresh();
};

export default signOutUser;
